import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import { Cache } from "cache-manager";

@Injectable()
export class RedisCacheService {
    constructor(
        @Inject(CACHE_MANAGER) private cacheManager: Cache
    ) { }

    public get(key: string) {
        return this.cacheManager.get(key)
    }

    public set(data: any, key: string, ttl?: number) {
        this.cacheManager.set(key, data, ttl)
    }

    public async cbk(callback: () => any, key: string, ttl?: number) {
        const res = await this.cacheManager.get(key);
        if (!!res) return res;
        const data = await callback();
        await this.cacheManager.set(key, data, ttl)
        return data;
    }
}
