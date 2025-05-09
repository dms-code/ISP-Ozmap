import { IDataSource } from '../IDataSource';
import { Cable } from '../../../domain/entities/Cable';
import { MongoDbManager } from '../../database/MongoDbManager';
import logger from '../../../shared/utils/logger';
import { ObjectId } from 'mongodb';

export class CableMongoSource implements IDataSource<Cable> {
  
  private mongoDbManager: MongoDbManager;

  constructor(mongoDbManager: MongoDbManager) {
    this.mongoDbManager = mongoDbManager;
  }

  async get(data: Cable): Promise<Cable | null> {
    let isConnected = false;
    try {
      await this.mongoDbManager.connect();
      isConnected = true;
      const db = this.mongoDbManager['db'];
      if (!db) {
        throw new Error('MongoDB não conectado');
      }
      const cableDoc = await db.collection('cables').findOne({ id: data.id });
      if (!cableDoc) {
        return null;
      }
      return new Cable({
        id: cableDoc.id,
        name: cableDoc.name,
        capacity: cableDoc.capacity,
        boxes_connected: cableDoc.boxes_connected,
        path: cableDoc.path,
        ozmapData: cableDoc.ozmapData ?? null,
      });
    } catch (error) {
      logger.error('Erro ao buscar cable no MongoDB:', error);
      return null;
    } finally {
      if (isConnected) {
        await this.mongoDbManager.disconnect();
      }
    }
  }

  async getData(): Promise<Cable[]> {
    // TODO: Implementar integração real com MongoDB
    return [];
  }

  async save(data: Cable): Promise<boolean> {
    let isConnected = false;
    try {
      await this.mongoDbManager.connect();
      isConnected = true;

      const db = this.mongoDbManager['db'];

      if (!db) {
        throw new Error('MongoDB não conectado');
      }

      await db.collection('cables').updateOne(
        { id: data.id },
        {
          $set: {
            id: data.id,
            name: data.name,
            capacity: data.capacity,
            boxes_connected: data.boxes_connected,
            path: data.path,
            ozmapData: data.ozmapData
          }
        },
        { upsert: true }
      );
      return true;
    } catch (error) {
      logger.error('Erro ao salvar cable no MongoDB:', error);
      return false;
    } finally {
      if (isConnected) {
        await this.mongoDbManager.disconnect();
      }
    }
  }
}
