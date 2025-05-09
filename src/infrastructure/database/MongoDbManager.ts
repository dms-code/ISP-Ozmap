import { MongoClient, Db, Collection } from 'mongodb';
import { Box } from '../../domain/entities/Box';
import { Cable } from '../../domain/entities/Cable';
import { Customer } from '../../domain/entities/Customer';
import { DropCable } from '../../domain/entities/DropCable';
import { EnvConfig } from '../../shared/config/env';

export class MongoDbManager {
  private client: MongoClient;
  private db?: Db;
  private readonly dbName: string;

  constructor() {
    this.client = new MongoClient(EnvConfig.getMongoUri());
    this.dbName = EnvConfig.getMongoDb();
  }

  async connect(): Promise<void> {
    await this.client.connect();
    this.db = this.client.db(this.dbName);
  }


  async disconnect(): Promise<void> {
    await this.client.close();
  }
}
