"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MongooseModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const config_1 = require("@nestjs/config");
const all_schemas_1 = require("./schemas/all-schemas");
let MongooseModule = class MongooseModule {
};
exports.MongooseModule = MongooseModule;
exports.MongooseModule = MongooseModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forRootAsync({
                imports: [config_1.ConfigModule],
                inject: [config_1.ConfigService],
                useFactory: (configService) => ({
                    uri: configService.get('app.mongodbUri'),
                    connectionFactory: (connection) => {
                        connection.on('connected', () => console.log('✅ MongoDB connected'));
                        connection.on('error', (error) => console.error('❌ MongoDB connection error:', error));
                        return connection;
                    },
                }),
            }),
            mongoose_1.MongooseModule.forFeature([
                { name: all_schemas_1.ChatConversation.name, schema: all_schemas_1.ChatConversationSchema },
                { name: all_schemas_1.ChatMessage.name, schema: all_schemas_1.ChatMessageSchema },
                { name: all_schemas_1.DocumentGenerationLog.name, schema: all_schemas_1.DocumentGenerationLogSchema },
                { name: all_schemas_1.AnalyticsEvent.name, schema: all_schemas_1.AnalyticsEventSchema },
            ]),
        ],
        exports: [mongoose_1.MongooseModule],
    })
], MongooseModule);
//# sourceMappingURL=mongoose.module.js.map