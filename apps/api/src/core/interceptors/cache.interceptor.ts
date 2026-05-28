import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable, of, tap } from 'rxjs';
import { RedisService } from '../redis/redis.service';
import { Reflector } from '@nestjs/core';

export const CACHE_KEY = 'cache_key';
export const CACHE_TTL = 'cache_ttl';

@Injectable()
export class CacheInterceptor implements NestInterceptor {
  constructor(
    private redisService: RedisService,
    private reflector: Reflector,
  ) {}

  async intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<any>> {
    const cacheKey = this.reflector.get<string>(CACHE_KEY, context.getHandler());
    const cacheTtl = this.reflector.get<number>(CACHE_TTL, context.getHandler()) || 60;

    if (!cacheKey) {
      return next.handle();
    }

    // Build dynamic key from request params
    const request = context.switchToHttp().getRequest();
    const dynamicKey = `${cacheKey}:${request.params.id || ''}:${JSON.stringify(request.query)}`;

    // Check cache
    const cached = await this.redisService.getJson(dynamicKey);
    if (cached) {
      return of(cached);
    }

    // Cache miss - execute handler and cache result
    return next.handle().pipe(
      tap(async (data) => {
        await this.redisService.setJson(dynamicKey, data, cacheTtl);
      }),
    );
  }
}
