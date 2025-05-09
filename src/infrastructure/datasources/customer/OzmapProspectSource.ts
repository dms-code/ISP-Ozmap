import axios from 'axios';
import { IDataSource } from '../IDataSource';
import logger from '../../../shared/utils/logger';
import { EnvConfig } from '../../../shared/config/env';
import OZMapSDK, { CreateProspectDTO, Prospect } from '@ozmap/ozmap-sdk';

export class OzmapProspectSource implements IDataSource<Prospect> {
  async get(data: Prospect): Promise<Prospect | null> {
    return null;
  }
  private sdk: OZMapSDK;

  constructor(sdk: OZMapSDK) {
    this.sdk = sdk;
  }

  async getData(): Promise<Prospect[]> {
    return [];
  }

  async save(data: Prospect): Promise<boolean> {
    return true;
  }

  async saveProspect(data: CreateProspectDTO): Promise<Prospect | null> {
    try {
      const response = await this.sdk.prospect.create(data);
      return response;
    } catch (error) {
      logger.error('Erro ao salvar prospect no Ozmap:', error instanceof Error ? error.message : error);
      return null;
    }
  }
}

