import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as Minio from 'minio';

@Injectable()
export class StorageService implements OnModuleInit {
  private readonly logger = new Logger(StorageService.name);
  private readonly client: Minio.Client;
  private readonly bucket: string;

  constructor(private configService: ConfigService) {
    this.bucket = this.configService.get<string>('app.minioBucket') || 'consultlegal';

    this.client = new Minio.Client({
      endPoint: this.configService.get<string>('app.minioEndpoint') || 'localhost',
      port: this.configService.get<number>('app.minioPort') || 9000,
      useSSL: this.configService.get<boolean>('app.minioUseSsl') || false,
      accessKey: this.configService.get<string>('app.minioAccessKey') || 'minioadmin',
      secretKey: this.configService.get<string>('app.minioSecretKey') || 'minioadmin123',
    });
  }

  async onModuleInit() {
    try {
      // Ensure bucket exists
      const exists = await this.client.bucketExists(this.bucket);
      if (!exists) {
        await this.client.makeBucket(this.bucket, 'us-east-1');
        this.logger.log(`✅ Created MinIO bucket: ${this.bucket}`);
      } else {
        this.logger.log(`✅ MinIO bucket exists: ${this.bucket}`);
      }
    } catch (err) {
      this.logger.warn(`⚠️ MinIO init failed (storage unavailable): ${err.message}`);
    }
  }

  // ─── Upload file from buffer ───
  async uploadBuffer(
    objectKey: string,
    buffer: Buffer,
    contentType: string = 'application/octet-stream',
  ): Promise<string> {
    await this.client.putObject(this.bucket, objectKey, buffer, buffer.length, {
      'Content-Type': contentType,
    });
    return objectKey;
  }

  // ─── Upload file from stream ───
  async uploadStream(
    objectKey: string,
    stream: any,
    size: number,
    contentType: string = 'application/octet-stream',
  ): Promise<string> {
    await this.client.putObject(this.bucket, objectKey, stream, size, {
      'Content-Type': contentType,
    });
    return objectKey;
  }

  // ─── Generate presigned download URL ───
  async getPresignedUrl(objectKey: string, expirySeconds: number = 3600): Promise<string> {
    return this.client.presignedGetObject(this.bucket, objectKey, expirySeconds);
  }

  // ─── Generate presigned upload URL ───
  async getPresignedUploadUrl(objectKey: string, expirySeconds: number = 3600): Promise<string> {
    return this.client.presignedPutObject(this.bucket, objectKey, expirySeconds);
  }

  // ─── Download file as buffer ───
  async downloadBuffer(objectKey: string): Promise<Buffer> {
    const dataStream = await this.client.getObject(this.bucket, objectKey);
    return new Promise((resolve, reject) => {
      const chunks: Buffer[] = [];
      dataStream.on('data', (chunk: Buffer) => chunks.push(chunk));
      dataStream.on('end', () => resolve(Buffer.concat(chunks)));
      dataStream.on('error', reject);
    });
  }

  // ─── Delete a file ───
  async delete(objectKey: string): Promise<void> {
    await this.client.removeObject(this.bucket, objectKey);
  }

  // ─── Delete multiple files ───
  async deleteMany(objectKeys: string[]): Promise<void> {
    await this.client.removeObjects(this.bucket, objectKeys);
  }

  // ─── Check if file exists ───
  async exists(objectKey: string): Promise<boolean> {
    try {
      await this.client.statObject(this.bucket, objectKey);
      return true;
    } catch {
      return false;
    }
  }

  // ─── Get file metadata ───
  async getStat(objectKey: string): Promise<Minio.BucketItemStat> {
    return this.client.statObject(this.bucket, objectKey);
  }

  // ─── List files with prefix ───
  async listObjects(prefix: string): Promise<any[]> {
    return new Promise((resolve, reject) => {
      const objects: any[] = [];
      const stream = this.client.listObjects(this.bucket, prefix, true);
      stream.on('data', (obj: any) => objects.push(obj));
      stream.on('end', () => resolve(objects));
      stream.on('error', reject);
    });
  }
}
