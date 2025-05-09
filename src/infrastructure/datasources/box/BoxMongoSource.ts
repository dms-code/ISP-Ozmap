import { IDataSource } from '../IDataSource';
import { MongoDbManager } from '../../database/MongoDbManager';
import logger from '../../../shared/utils/logger';
import { Box } from '../../../domain/entities/Box';

export class BoxMongoSource implements IDataSource<Box> {
  private mongoDbManager: MongoDbManager;

  constructor(mongoDbManager: MongoDbManager) {
    this.mongoDbManager = mongoDbManager;
  }

  async get(data: Box): Promise<Box | null> {
    let isConnected = false;
    try {
      await this.mongoDbManager.connect();
      isConnected = true;
      const db = this.mongoDbManager['db'];
      if (!db) {
        throw new Error('MongoDB não conectado');
      }
      const boxDoc = await db.collection('boxes').findOne({ id: data.id });
      if (!boxDoc) {
        return null;
      }
      // Popula o objeto Box, inclusive ozmapData
      return new Box({
        id: boxDoc.id,
        name: boxDoc.name,
        type: boxDoc.type,
        lat: boxDoc.lat,
        lng: boxDoc.lng,
        ozmapData: boxDoc.ozmapData ?? null,
      });
    } catch (error) {
      logger.error('Erro ao buscar box no MongoDB:', error);
      return null;
    } finally {
      if (isConnected) {
        await this.mongoDbManager.disconnect();
      }
    }
  }

  async getData(): Promise<Box[]> {
    // TODO: Implementar integração real com MongoDB
    return [];
  }

  async save(data: Box): Promise<boolean> {
    let isConnected = false;
    try {
      await this.mongoDbManager.connect();
      isConnected = true;

      const db = this.mongoDbManager['db'];

      if (!db) {
        throw new Error('MongoDB não conectado');
      }

      await db.collection('boxes').updateOne(
        { id: data.id },
        {
          $set: {
            id: data.id,
            name: data.name,
            type: data.type,
            lat: data.lat,
            lng: data.lng,
            ozmapData: data.ozmapData
          }
        },
        { upsert: true }
      );
      return true;
    } catch (error) {
      logger.error('Erro ao salvar box no MongoDB:', error);
      return false;
    } finally {
      if (isConnected) {
        await this.mongoDbManager.disconnect();
      }
    }
  }
}
