import logger from '../../../shared/utils/logger';
import { IDataSource } from '../IDataSource';
import OZMapSDK, { Box, CreateBoxDTO } from '@ozmap/ozmap-sdk';

export class BoxOzmapSource implements IDataSource<CreateBoxDTO> {
  async get(data: CreateBoxDTO): Promise<CreateBoxDTO | null> {
    return null;
  }
  private sdk: OZMapSDK;

  constructor(sdk: OZMapSDK) {
    this.sdk = sdk;
  }

  async saveBox(data: CreateBoxDTO): Promise<Box> {
    try {
      return await this.sdk.box.create(data);
    } catch (error) {
      logger.error('Erro ao salvar box no Ozmap:', error);
      throw error;
    }
  }
  
  async getData(): Promise<any> {
    return [];
  }
  async save(data: any): Promise<boolean> {
    return false;
  }
  
}
