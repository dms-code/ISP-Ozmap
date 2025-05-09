import { IDataSource } from '../IDataSource';
import { MongoDbManager } from '../../database/MongoDbManager';
import logger from '../../../shared/utils/logger';
import { DropCable } from '../../../domain/entities/DropCable';

export class DropCableMongoSource implements IDataSource<DropCable> {
  
  private mongoDbManager: MongoDbManager;

  constructor(mongoDbManager: MongoDbManager) {
    this.mongoDbManager = mongoDbManager;
  }

  async get(data: DropCable): Promise<DropCable | null> {
    // Busca o drop_cable pelo box_id
    let isConnected = false;
    try {
      await this.mongoDbManager.connect();
      isConnected = true;
      const db = this.mongoDbManager['db'];
      if (!db) {
        throw new Error('MongoDB não conectado');
      }
      const dropCableDoc = await db.collection('drop_cables').findOne({ box_id: data.box_id });
      if (!dropCableDoc) {
        return null;
      }
      return new DropCable({
        id: dropCableDoc.id,
        name: dropCableDoc.name,
        box_id: dropCableDoc.box_id,
        customer_id: dropCableDoc.customer_id,
        ozmapData: dropCableDoc.ozmapData ?? null,
      });
    } catch (error) {
      logger.error('Erro ao buscar drop cable no MongoDB:', error);
      return null;
    } finally {
      if (isConnected) {
        await this.mongoDbManager.disconnect();
      }
    }
  }

  async getData(): Promise<DropCable[]> {
    // TODO: Implementar integração real com MongoDB
    return [];
  }

  async save(data: DropCable): Promise<boolean> {
    let isConnected = false;
    try {
      await this.mongoDbManager.connect();
      isConnected = true;

      const db = this.mongoDbManager['db'];

      if (!db) {
        throw new Error('MongoDB não conectado');
      }

      await db.collection('drop_cables').updateOne(
        { id: data.id },
        {
          $set: {
            id: data.id,
            name: data.name,
            box_id: data.box_id,
            customer_id: data.customer_id,
            ...(data.ozmapData != null ? { ozmapData: data.ozmapData } : {})
          }
        },
        { upsert: true }
      );
      return true;
    } catch (error) {
      logger.error('Erro ao salvar drop cable no MongoDB:', error);
      return false;
    } finally {
      if (isConnected) {
        await this.mongoDbManager.disconnect();
      }
    }
  }
}
