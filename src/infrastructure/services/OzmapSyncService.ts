import { Box } from '../../domain/entities/Box';
import { Customer } from '../../domain/entities/Customer';
import logger from '../../shared/utils/logger';
import RedisManager from '../redis/RedisManager';
import { OzmapProspectRepository } from '../repositories/OzmapProspectRepository';
import { OzmapBoxRepository } from '../repositories/OzmapBoxRepository';
import { OzmapCableRepository } from '../../infrastructure/repositories/OzmapCableRepository';
import { Cable } from '../../domain/entities/Cable';
import { OzmapProjectRepository } from '../../infrastructure/repositories/OzmapProjectRepository';
import { DropCable } from '../../domain/entities/DropCable';

export class OzmapSyncService {
  private static _shouldStop: boolean = false;
  private static _processedCount: number = 0;
  private static _lastError: string | null = null;

  static get processedCount(): number {
    return this._processedCount;
  }

  static get lastError(): string | null {
    return this._lastError;
  }

  static async sync(): Promise<void> {
    const redis = await RedisManager.getInstance().getClient();
    const streamKey = 'events-stream';

    if(!redis) {
      logger.error('Redis client not initialized');
      return;
    }

    logger.info(`Starting Redis stream consumer (stream: ${streamKey})`);

    while (!this._shouldStop) {
      try {
        if (!redis) {
          logger.error('Redis connection closed');
          return;
        }

        const messages = await redis.xRead(
          { key: streamKey, id: '0' }
        );

        if (!messages || messages.length === 0) {
          await new Promise(resolve => setTimeout(resolve, 100)); // Wait before retry
          continue;
        }

        for (const redisMessage of messages[0].messages) {
          try {
            logger.debug(`Processing message ID: ${redisMessage.id}`);
            await this.processMessage(redisMessage.message);
            
            await redis.xDel(streamKey, redisMessage.id);
            
            this._processedCount++;
            this._lastError = null;
          } catch (e) {
            this._lastError = e instanceof Error ? e.message : 'Unknown error';
            logger.error(`Error processing message ${redisMessage.id}: ${this._lastError}`);
          }
        }
      } catch (e) {
        this._lastError = e instanceof Error ? e.message : 'Unknown error';
        logger.error(`Redis operation failed: ${this._lastError}`);
        await new Promise(resolve => setTimeout(resolve, 1000)); // Wait before retry
      }
    }
  }

  private static async processMessage(message: any): Promise<void> {
    
    logger.info(`Processando mensagem: ${JSON.stringify(message)}`);
    
    if (message.type === 'Customer') {
      const prospectRepository = new OzmapProspectRepository();
      const customer = Customer.fromJson(JSON.parse(message.data));

      try {
        await prospectRepository.save(customer);
        logger.info(`Cliente ${customer.code} salvo com sucesso no Ozmap`);
      } catch (error) {
        logger.error(`Erro ao salvar Customer  ${customer.code} no Ozmap: ${error instanceof Error ? error.message : error}`);
      }
    }
    else if(message.type === "DropCable") {
      const projectRepository = new OzmapProjectRepository();
      const dropCable = DropCable.fromJson(JSON.parse(message.data));

      try {
        await projectRepository.save(dropCable);
        logger.info(`DropCable ${dropCable.name} salvo com sucesso no Ozmap`);
      } catch (error) {
        logger.error(`Erro ao salvar DropCable  ${dropCable.name} no Ozmap: ${error instanceof Error ? error.message : error}`);
      }
    }
    else if (message.type === 'Box') {
      const boxRepository = new OzmapBoxRepository();
      const box = Box.fromJson(JSON.parse(message.data));

      try {
        await boxRepository.save(box);
        logger.info(`Box ${box.name} salvo com sucesso no Ozmap`);
      } catch (error) {
        logger.error(`Erro ao salvar Box  ${box.name} no Ozmap: ${error instanceof Error ? error.message : error}`);
      }
    }
    else if (message.type === 'Cable') {
      const cableRepository = new OzmapCableRepository();
      const cable = Cable.fromJson(JSON.parse(message.data));

      try {
        await cableRepository.save(cable);
        logger.info(`Cable ${cable.name} salvo com sucesso no Ozmap`);
      } catch (error) {
        logger.error(`Erro ao salvar Cable  ${cable.name} no Ozmap: ${error instanceof Error ? error.message : error}`);
      }
    }
    else {
      logger.info(`Ignorando mensagem de tipo: ${message.type}`);
    }
  }

  static cancel(): void {
    this._shouldStop = true;
    logger.info('Cancellation requested');
  }
}