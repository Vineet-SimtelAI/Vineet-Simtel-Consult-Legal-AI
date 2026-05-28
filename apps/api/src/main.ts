import { NestFactory } from '@nestjs/core';
import { Logger } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create(AppModule);

  // Global prefix for all API routes
  app.setGlobalPrefix('api/v1', {
    exclude: ['health'],
  });

  // CORS
  app.enableCors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  });

  // Swagger API Documentation
  const config = new DocumentBuilder()
    .setTitle('ConsultLegal API')
    .setDescription('Full-stack legal tech platform — Backend API documentation')
    .setVersion('1.0')
    .addBearerAuth()
    .addTag('Authentication', 'User authentication via Google OAuth and Phone OTP')
    .addTag('Users', 'User profile and dashboard management')
    .addTag('Documents', 'Legal document generation and management')
    .addTag('AI Chat', 'AI-powered legal assistant chat')
    .addTag('Lawyers', 'Lawyer marketplace and profiles')
    .addTag('Consultations', 'Lawyer consultation booking')
    .addTag('Credits & Payments', 'Credit system and Razorpay payments')
    .addTag('Admin', 'Admin dashboard and management')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  // Health check endpoint
  app.use('/health', (req: any, res: any) => {
    res.json({
      status: 'ok',
      service: 'consultlegal-api',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
    });
  });

  const port = process.env.PORT || 4000;
  await app.listen(port);

  logger.log(`🚀 ConsultLegal API running on http://localhost:${port}`);
  logger.log(`📖 API Documentation: http://localhost:${port}/api/docs`);
  logger.log(`❤️  Health Check: http://localhost:${port}/health`);
}

bootstrap();
