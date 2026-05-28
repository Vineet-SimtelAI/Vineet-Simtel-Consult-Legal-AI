import { OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
export declare class RedisService implements OnModuleDestroy {
    private configService;
    private readonly logger;
    private readonly client;
    private readonly subscriber;
    private readonly publisher;
    constructor(configService: ConfigService);
    get(key: string): Promise<string | null>;
    set(key: string, value: string, ttlSeconds?: number): Promise<void>;
    del(key: string): Promise<void>;
    exists(key: string): Promise<boolean>;
    expire(key: string, ttlSeconds: number): Promise<void>;
    ttl(key: string): Promise<number>;
    incr(key: string): Promise<number>;
    incrBy(key: string, amount: number): Promise<number>;
    decrBy(key: string, amount: number): Promise<number>;
    hget(key: string, field: string): Promise<string | null>;
    hset(key: string, field: string, value: string): Promise<void>;
    hgetall(key: string): Promise<Record<string, string>>;
    acquireLock(key: string, ttlSeconds?: number): Promise<boolean>;
    releaseLock(key: string): Promise<void>;
    publish(channel: string, message: string): Promise<void>;
    subscribe(channel: string, callback: (message: string) => void): Promise<void>;
    getJson<T>(key: string): Promise<T | null>;
    setJson(key: string, value: any, ttlSeconds?: number): Promise<void>;
    onModuleDestroy(): Promise<void>;
}
