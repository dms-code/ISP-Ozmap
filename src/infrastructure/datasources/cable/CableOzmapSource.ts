import logger from '../../../shared/utils/logger';
import { IDataSource } from '../IDataSource';
import OZMapSDK, { Cable, CreateCableDTO } from '@ozmap/ozmap-sdk';

export class CableOzmapSource implements IDataSource<CreateCableDTO> {
  private sdk: OZMapSDK;

  constructor(sdk: OZMapSDK) {
    this.sdk = sdk;
  }

  async saveCable(data: CreateCableDTO): Promise<Cable> {
    try {
      return await this.sdk.cable.create(data);
    } catch (error) {
      logger.error('Erro ao salvar cable no Ozmap:', error);
      throw error;
    }
  }

  async get(data: CreateCableDTO): Promise<CreateCableDTO | null> {
    return null;
  }

  async getData(): Promise<any> {
    return [];
  }

  async save(data: any): Promise<boolean> {
    return false;
  }
}
