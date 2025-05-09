import logger from '../../shared/utils/logger';
import { EnvConfig } from '../../shared/config/env';
import { CustomerRepository } from '../repositories/CustomerRepository';
import { CustomerApiSource } from '../datasources/customer/CustomerApiSource';
import { BoxRepository } from '../repositories/BoxRepository';
import { BoxApiSource } from '../datasources/box/BoxApiSource';
import { CableRepository } from '../repositories/CableRepository';
import { CableApiSource } from '../datasources/cable/CableApiSource';
import { DropCableRepository } from '../repositories/DropCableRepository';
import { DropCableApiSource } from '../datasources/drop_cable/DropCableApiSource';
import { MongoDbManager } from '../database/MongoDbManager';
import { CustomerMongoSource } from '../datasources/customer/CustomerMongoSource';
import { BoxMongoSource } from '../datasources/box/BoxMongoSource';
import { CableMongoSource } from '../datasources/cable/CableMongoSource';
import { DropCableMongoSource } from '../datasources/drop_cable/DropCableMongoSource';
import RedisManager from '../redis/RedisManager';

export class IspSyncService {
  private static _shouldStop: boolean = false;
  /**
   * Busca os dados do servidor ISP
   */
  static async sync(): Promise<void> {
    IspSyncService._shouldStop = false;

    const mongoDbManager = new MongoDbManager();
  
    logger.info('Iniciando sincronização periódica com o ISP...');
    // Repositórios a serem sincronizados
    const repositories = [
      new CustomerRepository(new CustomerMongoSource(mongoDbManager), new CustomerApiSource()),
      new DropCableRepository(new DropCableMongoSource(mongoDbManager), new DropCableApiSource()),
      new BoxRepository(new BoxMongoSource(mongoDbManager), new BoxApiSource()), 
      new CableRepository(new CableMongoSource(mongoDbManager), new CableApiSource()),      
    ];

    const requestsPerMinute = EnvConfig.getIspRequestsPerMinute();
    const delaySeconds = EnvConfig.getIspRequestsDelaySeconds();
    let requestsCount = 0;
    let startWindow = Date.now();
    let repoIndex = 0;

    while (!IspSyncService._shouldStop) {
      // Reinicia a janela de contagem a cada minuto
      if ((Date.now() - startWindow) > 60000) {
        requestsCount = 0;
        startWindow = Date.now();
      }
      if (requestsCount >= requestsPerMinute) {
        logger.info(`Limite de ${requestsPerMinute} chamadas por minuto atingido. Aguardando ${delaySeconds} segundos...`);
        await new Promise(resolve => setTimeout(resolve, delaySeconds * 1000));
        requestsCount = 0;
        startWindow = Date.now();
        continue;
      }
      try {
        if (IspSyncService._shouldStop) {
          logger.info('Serviço de sync cancelado. Saindo do loop.');
          break;
        }
        const repo = repositories[repoIndex];
        logger.info(`Sincronizando dados do repositório: ${repo.constructor.name}`);
        logger.info(`Obtendo dados do repositório ${repo.constructor.name}...`);
        const data = await repo.getData();
        logger.info(`Salvando dados do repositório ${repo.constructor.name}...`);
        await repo.save();
        
        // Publica cada item no Redis Stream
        try {
          const redis = await RedisManager.getInstance().getClient();

          if(!redis) {
            logger.error('Redis client not initialized');
            return;
          }

          logger.info(`Adicionando dados do repositório ${repo.constructor.name} no Redis Stream...`);
          for (const item of data) {
            const type = (item as any).__type || item.constructor.name;
            await redis.xAdd('events-stream', '*', {
              type,
              data: JSON.stringify(item)
            });
          }
        } catch (error) {
          logger.error('Erro ao publicar no Redis Stream:', error);
        }

        repoIndex = (repoIndex + 1) % repositories.length;
      } catch (error) {
        logger.error('Erro ao Comunicar com servidor ISP:', error);
      }
      requestsCount++;
   }
  }

  static cancel(): void {
    IspSyncService._shouldStop = true;
    logger.info('Solicitação de cancelamento do serviço de sync recebida.');
  }
}
