import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PrismaService } from '../database/prisma/prisma.service';
import { StorageService } from '../storage/storage.service';
import { RedisService } from '../redis/redis.service';
import { AnalyticsEvent } from '../database/mongoose/schemas/all-schemas';
import { DocumentProcessor, GenerateJobData } from '../../modules/documents/processors/document.processor';

export interface QueueJob {
  id: string;
  type: string;
  data: any;
  attempts: number;
  maxAttempts: number;
  createdAt: Date;
  processAfter?: Date;
}

@Injectable()
export class QueueService {
  private readonly logger = new Logger(QueueService.name);

  constructor(
    private configService: ConfigService,
    @InjectModel(AnalyticsEvent.name) private analyticsModel: Model<AnalyticsEvent>,
    private prisma: PrismaService,
    private storageService: StorageService,
    private redisService: RedisService,
  ) {}

  /**
   * Enqueue a job for processing.
   * Runs the DocumentProcessor in the background with all required dependencies injected.
   */
  async enqueue(queueName: string, data: any, options?: { delay?: number; attempts?: number }): Promise<string> {
    const jobId = `job_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    this.logger.log(`Enqueued job [${jobId}] to queue [${queueName}]`);

    if (queueName === 'document:generate') {
      const processor = new DocumentProcessor(
        this.prisma,
        this.storageService,
        this.configService,
        this.redisService,
      );

      setTimeout(() => {
        processor.process(data as GenerateJobData)
          .then(() => {
            this.logger.log(`✅ Document job [${jobId}] completed`);
          })
          .catch((err: any) => {
            this.logger.error(`❌ Document job [${jobId}] failed: ${err.message}`);
          });
      }, options?.delay || 500);
    }

    return jobId;
  }

  /**
   * Track an analytics event
   */
  async trackEvent(event: string, userId?: string, properties?: Record<string, any>, req?: any): Promise<void> {
    await this.analyticsModel.create({
      userId,
      event,
      properties,
      userAgent: req?.headers?.['user-agent'],
      ip: req?.ip || req?.headers?.['x-forwarded-for'],
    });
  }
}
