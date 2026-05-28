import { ConfigService } from '@nestjs/config';
import { Model } from 'mongoose';
import { AnalyticsEvent } from '../database/mongoose/schemas/all-schemas';
export interface QueueJob {
    id: string;
    type: string;
    data: any;
    attempts: number;
    maxAttempts: number;
    createdAt: Date;
    processAfter?: Date;
}
export declare class QueueService {
    private configService;
    private analyticsModel;
    private readonly logger;
    constructor(configService: ConfigService, analyticsModel: Model<AnalyticsEvent>);
    enqueue(queueName: string, data: any, options?: {
        delay?: number;
        attempts?: number;
    }): Promise<string>;
    trackEvent(event: string, userId?: string, properties?: Record<string, any>, req?: any): Promise<void>;
}
