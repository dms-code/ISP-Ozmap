import { IRepository } from './IRepository';
import { Box } from '../../domain/entities/Box';
import logger from '../../shared/utils/logger';
import { BoxOzmapSource } from '../datasources/box/BoxOzmapSource';
import { BoxTypeOzmapSource } from '../datasources/box/BoxTypeOzmapSource';
import OZMapSDK, { CreateBoxDTO } from '@ozmap/ozmap-sdk';
import { EnvConfig } from '../../shared/config/env';
import { BoxMongoSource } from '../datasources/box/BoxMongoSource';
import { MongoDbManager } from '../database/MongoDbManager';
import { DropCable } from '../../domain/entities/DropCable';
import { DropCableMongoSource } from '../../infrastructure/datasources/drop_cable/DropCableMongoSource';

export class OzmapBoxRepository implements IRepository<Box> {
  
  private boxSource: BoxOzmapSource;
  private boxTypeSource: BoxTypeOzmapSource;
  private boxMongoSource: BoxMongoSource;
  private dropCableSource: DropCableMongoSource;
  
  constructor() {

    const baseUrl = EnvConfig.getOzmapApiBaseUrl();
    const apiKey = EnvConfig.getOzmapApiKey();

    const sdk = new OZMapSDK(baseUrl, {apiKey});

    const mongoDbManager = new MongoDbManager();
    this.boxSource = new BoxOzmapSource(sdk);
    this.boxMongoSource = new BoxMongoSource(mongoDbManager);
    this.boxTypeSource = new BoxTypeOzmapSource(sdk);
    this.dropCableSource = new DropCableMongoSource(mongoDbManager);

  }

  async getData(): Promise<Box[]> {
    return [];
  }

  async save(data: Box): Promise<boolean> {

    //Busca os tipos do Ozmap
    const boxTypes = await this.boxTypeSource.getData();
    
    //Busca o tipo do box
    const boxType = boxTypes.find(type => type.code === data.type);

    if(!boxType) {
      logger.error('Tipo do box não encontrado');
      return false;
    }

    //Busca o drop_cable pelo id do box
    const dropCable = await this.dropCableSource.get(DropCable.fromJson({box_id: data.id}));

    if(!dropCable) {
      logger.error('Drop cable do box não encontrado');
      return false;
    }
    
    //Cria o objeto do tipo CreateBoxDTO
    const boxDto: CreateBoxDTO = {
      name: data.name,
      boxType: boxType.id,
      coords: [data.lat, data.lng],
      project: dropCable.ozmapData.id, // Id do Project
      hierarchyLevel: 1,
      implanted: true
    };

    const box = await this.boxSource.saveBox(boxDto);

    if (!box) {
      logger.error('Erro ao salvar box no Ozmap');
      return false;
    }

    data.ozmapData = box;

    const saved = await this.boxMongoSource.save(data);

    if (!saved) {
      logger.error('Erro ao salvar box no MongoDB');
      return false;
    }

    return true;
  }

  async get(obj: Box): Promise<Box | null> {
    return await this.boxMongoSource.get(obj);
  }
}
