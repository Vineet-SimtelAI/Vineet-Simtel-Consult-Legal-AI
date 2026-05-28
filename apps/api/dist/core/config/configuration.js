"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("@nestjs/config");
exports.default = (0, config_1.registerAs)('app', () => ({
    databaseUrl: process.env.DATABASE_URL,
    mongodbUri: process.env.MONGODB_URI,
    redisHost: process.env.REDIS_HOST || 'localhost',
    redisPort: parseInt(process.env.REDIS_PORT || '6379', 10),
    redisPassword: process.env.REDIS_PASSWORD || '',
    minioEndpoint: process.env.MINIO_ENDPOINT || 'localhost',
    minioPort: parseInt(process.env.MINIO_PORT || '9000', 10),
    minioAccessKey: process.env.MINIO_ACCESS_KEY || 'minioadmin',
    minioSecretKey: process.env.MINIO_SECRET_KEY || 'minioadmin123',
    minioBucket: process.env.MINIO_BUCKET || 'consultlegal',
    minioUseSsl: process.env.MINIO_USE_SSL === 'true',
    jwtSecret: process.env.JWT_SECRET || 'consultlegal-jwt-secret-2024',
    jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
    awsRegion: process.env.AWS_REGION || 'ap-south-1',
    awsAccessKeyId: process.env.AWS_ACCESS_KEY_ID,
    awsSecretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    razorpayKeyId: process.env.RAZORPAY_KEY_ID,
    razorpayKeySecret: process.env.RAZORPAY_KEY_SECRET,
    aiApiKey: process.env.AI_API_KEY,
    aiModel: process.env.AI_MODEL || 'gpt-4',
    aiBaseUrl: process.env.AI_BASE_URL,
    port: parseInt(process.env.PORT || '4000', 10),
    nodeEnv: process.env.NODE_ENV || 'development',
}));
//# sourceMappingURL=configuration.js.map