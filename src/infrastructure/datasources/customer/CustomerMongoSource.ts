import { IDataSource } from '../IDataSource';
import { Customer } from '../../../domain/entities/Customer';
import { MongoDbManager } from '../../database/MongoDbManager';
import logger from '../../../shared/utils/logger';
import { ObjectId } from 'mongodb';

export class CustomerMongoSource implements IDataSource<Customer> {
  
  private mongoDbManager: MongoDbManager;

  constructor(mongoDbManager: MongoDbManager) {
    this.mongoDbManager = mongoDbManager;
  }

  async get(data: Customer): Promise<Customer | null> {
    let isConnected = false;
    try {
      await this.mongoDbManager.connect();
      isConnected = true;
      const db = this.mongoDbManager['db'];
      if (!db) {
        throw new Error('MongoDB não conectado');
      }
      const customerDoc = await db.collection('customers').findOne({ id: data.id });
      if (!customerDoc) {
        return null;
      }
      return new Customer({
        id: customerDoc.id,
        code: customerDoc.code,
        name: customerDoc.name,
        address: customerDoc.address,
        box_id: customerDoc.box_id,
        ozmapData: customerDoc.ozmapData ?? null,
      });
    } catch (error) {
      logger.error('Erro ao buscar customer no MongoDB:', error);
      return null;
    } finally {
      if (isConnected) {
        await this.mongoDbManager.disconnect();
      }
    }
  }

  async getData(): Promise<Customer[]> {
    return [];
  }

  async save(data: Customer): Promise<boolean> {
    let isConnected = false;
    try {
      await this.mongoDbManager.connect();
      isConnected = true;
      const db = this.mongoDbManager['db'];
      if (!db) {
        throw new Error('MongoDB não conectado');
      }
      const customers = db.collection('customers');
      const { ObjectId } = require('mongodb');
      let isValidObjectId = false;
      let objectId;
      // Verifica se id é um ObjectId válido
      if (typeof data.id === 'string' && /^[a-f\d]{24}$/i.test(data.id)) {
        try {
          objectId = new ObjectId(data.id);
          isValidObjectId = true;
        } catch (_) {
          isValidObjectId = false;
        }
      }
      // Faz update pelo campo id (que é um número), não pelo _id do MongoDB
      await customers.updateOne(
        { id: data.id },
        {
          $set: {
            id: data.id,
            code: data.code,
            name: data.name,
            address: data.address,
            box_id: data.box_id,
            ...(data.ozmapData != null ? { ozmapData: data.ozmapData } : {})
          }
        },
        { upsert: true }
      );
      return true;
    } catch (error) {
      logger.error('Erro ao salvar customer no MongoDB:', error);
      return false;
    } finally {
      if (isConnected) {
        await this.mongoDbManager.disconnect();
      }
    }
  }
}
