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
var RedisService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.RedisService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const ioredis_1 = require("ioredis");
let RedisService = RedisService_1 = class RedisService {
    constructor(configService) {
        this.configService = configService;
        this.logger = new common_1.Logger(RedisService_1.name);
        const host = this.configService.get('app.redisHost');
        const port = this.configService.get('app.redisPort');
        const password = this.configService.get('app.redisPassword');
        const connectionOptions = {
            host,
            port,
            password,
            retryStrategy: (times) => {
                const delay = Math.min(times * 50, 2000);
                return delay;
            },
            maxRetriesPerRequest: 3,
        };
        this.client = new ioredis_1.default(connectionOptions);
        this.subscriber = new ioredis_1.default(connectionOptions);
        this.publisher = new ioredis_1.default(connectionOptions);
        this.client.on('connect', () => this.logger.log('✅ Redis connected'));
        this.client.on('error', (err) => this.logger.error('Redis error:', err.message));
    }
    async get(key) {
        return this.client.get(key);
    }
    async set(key, value, ttlSeconds) {
        if (ttlSeconds) {
            await this.client.set(key, value, 'EX', ttlSeconds);
        }
        else {
            await this.client.set(key, value);
        }
    }
    async del(key) {
        await this.client.del(key);
    }
    async exists(key) {
        const result = await this.client.exists(key);
        return result === 1;
    }
    async expire(key, ttlSeconds) {
        await this.client.expire(key, ttlSeconds);
    }
    async ttl(key) {
        return this.client.ttl(key);
    }
    async incr(key) {
        return this.client.incr(key);
    }
    async incrBy(key, amount) {
        return this.client.incrby(key, amount);
    }
    async decrBy(key, amount) {
        return this.client.decrby(key, amount);
    }
    async hget(key, field) {
        return this.client.hget(key, field);
    }
    async hset(key, field, value) {
        await this.client.hset(key, field, value);
    }
    async hgetall(key) {
        return this.client.hgetall(key);
    }
    async acquireLock(key, ttlSeconds = 10) {
        const result = await this.client.set(key, '1', 'EX', ttlSeconds, 'NX');
        return result === 'OK';
    }
    async releaseLock(key) {
        await this.client.del(key);
    }
    async publish(channel, message) {
        await this.publisher.publish(channel, message);
    }
    async subscribe(channel, callback) {
        this.subscriber.subscribe(channel);
        this.subscriber.on('message', (ch, msg) => {
            if (ch === channel) {
                callback(msg);
            }
        });
    }
    async getJson(key) {
        const data = await this.client.get(key);
        if (!data)
            return null;
        try {
            return JSON.parse(data);
        }
        catch {
            return null;
        }
    }
    async setJson(key, value, ttlSeconds) {
        const data = JSON.stringify(value);
        await this.set(key, data, ttlSeconds);
    }
    async onModuleDestroy() {
        await this.client.quit();
        await this.subscriber.quit();
        await this.publisher.quit();
        this.logger.log('Redis connections closed');
    }
};
exports.RedisService = RedisService;
exports.RedisService = RedisService = RedisService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], RedisService);
//# sourceMappingURL=redis.service.js.map