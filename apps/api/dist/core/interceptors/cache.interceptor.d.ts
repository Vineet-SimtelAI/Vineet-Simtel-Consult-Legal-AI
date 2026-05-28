import { NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { RedisService } from '../redis/redis.service';
import { Reflector } from '@nestjs/core';
export declare const CACHE_KEY = "cache_key";
export declare const CACHE_TTL = "cache_ttl";
export declare class CacheInterceptor implements NestInterceptor {
    private redisService;
    private reflector;
    constructor(redisService: RedisService, reflector: Reflector);
    intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<any>>;
}
