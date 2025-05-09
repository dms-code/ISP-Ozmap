import { IRepository } from './IRepository';
import logger from '../../shared/utils/logger';
import { Cable } from '../../domain/entities/Cable';
import { Box } from '../../domain/entities/Box';
import { CableRepository } from './CableRepository';
import { BoxRepository } from './BoxRepository';
import { MongoDbManager } from '../database/MongoDbManager';
import { EnvConfig } from '../../shared/config/env';
import OZMapSDK from '@ozmap/ozmap-sdk';
import { CableMongoSource } from '../datasources/cable/CableMongoSource';
import { BoxMongoSource } from '../datasources/box/BoxMongoSource';

// Tipos do SDK Ozmap
import type { CreateCableDTO } from '@ozmap/ozmap-sdk';

export class OzmapCableRepository implements IRepository<Cable> {
  private cableRepo: CableMongoSource;
  private boxRepo: BoxMongoSource;
  private sdk: OZMapSDK;

  constructor() {
    const baseUrl = EnvConfig.getOzmapApiBaseUrl();
    const apiKey = EnvConfig.getOzmapApiKey();
    this.sdk = new OZMapSDK(baseUrl, { apiKey });
    
    const mongoDbManager = new MongoDbManager();
    this.cableRepo = new CableMongoSource(mongoDbManager);
    this.boxRepo = new BoxMongoSource(mongoDbManager);
  }

  async getData(): Promise<Cable[]> {
    return [];
  }

  async get(obj: Cable): Promise<Cable | null> {
    return await this.cableRepo.get(obj);
  }

  async save(data: Cable): Promise<boolean> {
    logger.info('Salvando cable no Ozmap (save)', data);
    // Buscar os boxes conectados
    const boxIds = data.boxes_connected || [];
    const boxes: Box[] = [];
    for (const id of boxIds) {
      const box = await this.boxRepo.get({ id } as Box);
      if (box) boxes.push(box);
    }
    // Extrair os IDs do Ozmap dos boxes
    const ozmapBoxIds = boxes.map(b => b.ozmapData?.id).filter(Boolean);
    // Construir o DTO
    // Usar método do modelo para montar o DTO correto
    const createCableDto: CreateCableDTO = {
      external_id: data.id,
      name: data.name,
      project: '',
      cableType: '',
      hierarchyLevel: 1,
      implanted: false,
      poles: data.path.map(point => ({ lat: point.lat, lng: point.lng })),
    }
    
    // Ajustar boxA e boxB após montar o DTO
    if (ozmapBoxIds.length === 1) {
      createCableDto.boxA = ozmapBoxIds[0];
    } else if (ozmapBoxIds.length >= 2) {
      createCableDto.boxA = ozmapBoxIds[0];
      createCableDto.boxB = ozmapBoxIds[1];
    }
    // Salvar cable no Ozmap
    const ozmapCable = await this.sdk.cable.create(createCableDto);
    if (!ozmapCable) {
      logger.error('Erro ao salvar cable no Ozmap (SDK retornou null)');
      return false;
    }
    // Atualizar campo ozmapData do cable
    data.ozmapData = ozmapCable;
    // Atualizar cable no MongoDB
    const mongoResult = await this.cableRepo.save(data);
    if (!mongoResult) {
      logger.error('Erro ao atualizar cable no MongoDB após salvar no Ozmap');
      return false;
    }
    logger.info('Cable salvo com sucesso no Ozmap e MongoDB');
    return true;
  }
}
