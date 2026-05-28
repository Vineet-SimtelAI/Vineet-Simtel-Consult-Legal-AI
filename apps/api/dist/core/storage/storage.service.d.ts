import { OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as Minio from 'minio';
export declare class StorageService implements OnModuleInit {
    private configService;
    private readonly logger;
    private readonly client;
    private readonly bucket;
    constructor(configService: ConfigService);
    onModuleInit(): Promise<void>;
    uploadBuffer(objectKey: string, buffer: Buffer, contentType?: string): Promise<string>;
    uploadStream(objectKey: string, stream: any, size: number, contentType?: string): Promise<string>;
    getPresignedUrl(objectKey: string, expirySeconds?: number): Promise<string>;
    getPresignedUploadUrl(objectKey: string, expirySeconds?: number): Promise<string>;
    downloadBuffer(objectKey: string): Promise<Buffer>;
    delete(objectKey: string): Promise<void>;
    deleteMany(objectKeys: string[]): Promise<void>;
    exists(objectKey: string): Promise<boolean>;
    getStat(objectKey: string): Promise<Minio.BucketItemStat>;
    listObjects(prefix: string): Promise<any[]>;
}
