"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const common_2 = require("@nestjs/common");
const config_module_1 = require("./core/config/config.module");
const prisma_module_1 = require("./core/database/prisma/prisma.module");
const mongoose_module_1 = require("./core/database/mongoose/mongoose.module");
const redis_module_1 = require("./core/redis/redis.module");
const storage_module_1 = require("./core/storage/storage.module");
const queue_module_1 = require("./core/queue/queue.module");
const logging_interceptor_1 = require("./core/interceptors/logging.interceptor");
const transform_interceptor_1 = require("./core/interceptors/transform.interceptor");
const http_exception_filter_1 = require("./core/filters/http-exception.filter");
const auth_module_1 = require("./modules/auth/auth.module");
const users_module_1 = require("./modules/users/users.module");
const documents_module_1 = require("./modules/documents/documents.module");
const chat_module_1 = require("./modules/chat/chat.module");
const lawyers_module_1 = require("./modules/lawyers/lawyers.module");
const consultations_module_1 = require("./modules/consultations/consultations.module");
const payments_module_1 = require("./modules/payments/payments.module");
const admin_module_1 = require("./modules/admin/admin.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_module_1.AppConfigModule,
            prisma_module_1.PrismaModule,
            mongoose_module_1.MongooseModule,
            redis_module_1.RedisModule,
            storage_module_1.StorageModule,
            queue_module_1.QueueModule,
            auth_module_1.AuthModule,
            users_module_1.UsersModule,
            documents_module_1.DocumentsModule,
            chat_module_1.ChatModule,
            lawyers_module_1.LawyersModule,
            consultations_module_1.ConsultationsModule,
            payments_module_1.PaymentsModule,
            admin_module_1.AdminModule,
        ],
        providers: [
            {
                provide: core_1.APP_PIPE,
                useValue: new common_2.ValidationPipe({
                    whitelist: true,
                    forbidNonWhitelisted: true,
                    transform: true,
                    transformOptions: { enableImplicitConversion: true },
                }),
            },
            {
                provide: core_1.APP_INTERCEPTOR,
                useClass: logging_interceptor_1.LoggingInterceptor,
            },
            {
                provide: core_1.APP_INTERCEPTOR,
                useClass: transform_interceptor_1.TransformInterceptor,
            },
            {
                provide: core_1.APP_FILTER,
                useClass: http_exception_filter_1.GlobalExceptionFilter,
            },
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map