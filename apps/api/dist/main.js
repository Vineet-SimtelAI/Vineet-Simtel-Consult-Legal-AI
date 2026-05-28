"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const app_module_1 = require("./app.module");
async function bootstrap() {
    const logger = new common_1.Logger('Bootstrap');
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.setGlobalPrefix('api/v1', {
        exclude: ['health'],
    });
    app.enableCors({
        origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    });
    const config = new swagger_1.DocumentBuilder()
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
    const document = swagger_1.SwaggerModule.createDocument(app, config);
    swagger_1.SwaggerModule.setup('api/docs', app, document);
    app.use('/health', (req, res) => {
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
//# sourceMappingURL=main.js.map