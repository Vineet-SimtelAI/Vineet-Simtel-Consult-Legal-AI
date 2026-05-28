import { registerAs } from '@nestjs/config';

export default registerAs('app', () => ({
  // Database
  databaseUrl: process.env.DATABASE_URL,
  mongodbUri: process.env.MONGODB_URI,

  // Redis
  redisHost: process.env.REDIS_HOST || 'localhost',
  redisPort: parseInt(process.env.REDIS_PORT || '6379', 10),
  redisPassword: process.env.REDIS_PASSWORD || '',

  // MinIO
  minioEndpoint: process.env.MINIO_ENDPOINT || 'localhost',
  minioPort: parseInt(process.env.MINIO_PORT || '9000', 10),
  minioAccessKey: process.env.MINIO_ACCESS_KEY || 'minioadmin',
  minioSecretKey: process.env.MINIO_SECRET_KEY || 'minioadmin123',
  minioBucket: process.env.MINIO_BUCKET || 'consultlegal',
  minioUseSsl: process.env.MINIO_USE_SSL === 'true',

  // Auth
  jwtSecret: process.env.JWT_SECRET || 'consultlegal-jwt-secret-2024',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',

  // AWS SNS
  awsRegion: process.env.AWS_REGION || 'ap-south-1',
  awsAccessKeyId: process.env.AWS_ACCESS_KEY_ID,
  awsSecretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,

  // Razorpay
  razorpayKeyId: process.env.RAZORPAY_KEY_ID,
  razorpayKeySecret: process.env.RAZORPAY_KEY_SECRET,

  // AI
  aiApiKey: process.env.AI_API_KEY,
  aiModel: process.env.AI_MODEL || 'gpt-4',
  aiBaseUrl: process.env.AI_BASE_URL,

  // App
  port: parseInt(process.env.PORT || '4000', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
}));
