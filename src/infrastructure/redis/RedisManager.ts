import { createClient, RedisClientType } from 'redis';
import { EnvConfig } from '../../shared/config/env';
import logger from '../../shared/utils/logger';

class RedisManager {
  private static instance: RedisManager;
  private client: RedisClientType | null = null;

  private constructor() {}

  public static getInstance(): RedisManager {
    if (!RedisManager.instance) {
      RedisManager.instance = new RedisManager();
    }
    return RedisManager.instance;
  }

  public async getClient(): Promise<RedisClientType | null> {
    if (!this.client) {
      try {
        this.client = createClient({
          socket: {
            host: EnvConfig.getRedisHost(),
            port: EnvConfig.getRedisPort(),
            timeout: EnvConfig.getRedisTimeout(),
          },
        });
        this.client.on('error', (err) => {
          logger.error('Redis Client Error', err);
          this.client = null;
          throw err;
        });
        await this.client.connect();
      } catch (err) {
        logger.error(
          'Erro ao conectar ao Redis',
          `Host: ${EnvConfig.getRedisHost()}`,
          `Port: ${EnvConfig.getRedisPort()}`,
          err,
        );
        this.client = null;
        throw err;
      }
    }
    return this.client;
  }
}

export default RedisManager;
