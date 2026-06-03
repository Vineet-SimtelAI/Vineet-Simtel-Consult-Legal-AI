"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var StorageService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.StorageService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const Minio = require("minio");
let StorageService = StorageService_1 = class StorageService {
    constructor(configService) {
        this.configService = configService;
        this.logger = new common_1.Logger(StorageService_1.name);
        this.bucket = this.configService.get('app.minioBucket') || 'consultlegal';
        this.client = new Minio.Client({
            endPoint: this.configService.get('app.minioEndpoint') || 'localhost',
            port: this.configService.get('app.minioPort') || 9000,
            useSSL: this.configService.get('app.minioUseSsl') || false,
            accessKey: this.configService.get('app.minioAccessKey') || 'minioadmin',
            secretKey: this.configService.get('app.minioSecretKey') || 'minioadmin123',
        });
    }
    async onModuleInit() {
        try {
            const exists = await this.client.bucketExists(this.bucket);
            if (!exists) {
                await this.client.makeBucket(this.bucket, 'us-east-1');
                this.logger.log(`✅ Created MinIO bucket: ${this.bucket}`);
            }
            else {
                this.logger.log(`✅ MinIO bucket exists: ${this.bucket}`);
            }
        }
        catch (err) {
            this.logger.warn(`⚠️ MinIO init failed (storage unavailable): ${err.message}`);
        }
    }
    async uploadBuffer(objectKey, buffer, contentType = 'application/octet-stream') {
        await this.client.putObject(this.bucket, objectKey, buffer, buffer.length, {
            'Content-Type': contentType,
        });
        return objectKey;
    }
    async uploadStream(objectKey, stream, size, contentType = 'application/octet-stream') {
        await this.client.putObject(this.bucket, objectKey, stream, size, {
            'Content-Type': contentType,
        });
        return objectKey;
    }
    async getPresignedUrl(objectKey, expirySeconds = 3600) {
        return this.client.presignedGetObject(this.bucket, objectKey, expirySeconds);
    }
    async getPresignedUploadUrl(objectKey, expirySeconds = 3600) {
        return this.client.presignedPutObject(this.bucket, objectKey, expirySeconds);
    }
    async downloadBuffer(objectKey) {
        const dataStream = await this.client.getObject(this.bucket, objectKey);
        return new Promise((resolve, reject) => {
            const chunks = [];
            dataStream.on('data', (chunk) => chunks.push(chunk));
            dataStream.on('end', () => resolve(Buffer.concat(chunks)));
            dataStream.on('error', reject);
        });
    }
    async delete(objectKey) {
        await this.client.removeObject(this.bucket, objectKey);
    }
    async deleteMany(objectKeys) {
        await this.client.removeObjects(this.bucket, objectKeys);
    }
    async exists(objectKey) {
        try {
            await this.client.statObject(this.bucket, objectKey);
            return true;
        }
        catch {
            return false;
        }
    }
    async getStat(objectKey) {
        return this.client.statObject(this.bucket, objectKey);
    }
    async listObjects(prefix) {
        return new Promise((resolve, reject) => {
            const objects = [];
            const stream = this.client.listObjects(this.bucket, prefix, true);
            stream.on('data', (obj) => objects.push(obj));
            stream.on('end', () => resolve(objects));
            stream.on('error', reject);
        });
    }
};
exports.StorageService = StorageService;
exports.StorageService = StorageService = StorageService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], StorageService);
//# sourceMappingURL=storage.service.js.map