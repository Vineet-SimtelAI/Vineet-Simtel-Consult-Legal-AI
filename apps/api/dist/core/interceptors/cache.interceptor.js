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
Object.defineProperty(exports, "__esModule", { value: true });
exports.CacheInterceptor = exports.CACHE_TTL = exports.CACHE_KEY = void 0;
const common_1 = require("@nestjs/common");
const rxjs_1 = require("rxjs");
const redis_service_1 = require("../redis/redis.service");
const core_1 = require("@nestjs/core");
exports.CACHE_KEY = 'cache_key';
exports.CACHE_TTL = 'cache_ttl';
let CacheInterceptor = class CacheInterceptor {
    constructor(redisService, reflector) {
        this.redisService = redisService;
        this.reflector = reflector;
    }
    async intercept(context, next) {
        const cacheKey = this.reflector.get(exports.CACHE_KEY, context.getHandler());
        const cacheTtl = this.reflector.get(exports.CACHE_TTL, context.getHandler()) || 60;
        if (!cacheKey) {
            return next.handle();
        }
        const request = context.switchToHttp().getRequest();
        const dynamicKey = `${cacheKey}:${request.params.id || ''}:${JSON.stringify(request.query)}`;
        const cached = await this.redisService.getJson(dynamicKey);
        if (cached) {
            return (0, rxjs_1.of)(cached);
        }
        return next.handle().pipe((0, rxjs_1.tap)(async (data) => {
            await this.redisService.setJson(dynamicKey, data, cacheTtl);
        }));
    }
};
exports.CacheInterceptor = CacheInterceptor;
exports.CacheInterceptor = CacheInterceptor = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [redis_service_1.RedisService,
        core_1.Reflector])
], CacheInterceptor);
//# sourceMappingURL=cache.interceptor.js.map