import { EnvConfig } from '../../../shared/config/env';
import logger from '../../../shared/utils/logger';
import { IDataSource } from '../IDataSource';
import OZMapSDK, { BoxType, CreateBoxTypeDTO } from '@ozmap/ozmap-sdk';

export class BoxTypeOzmapSource implements IDataSource<BoxType> {
  async get(data: BoxType): Promise<BoxType | null> {
    return null;
  }
  private sdk: OZMapSDK;

  constructor(sdk: OZMapSDK) {
    this.sdk = sdk;
  }

  async getData(): Promise<BoxType[]> {
    try {
      logger.info('Fetching box types from Ozmap API');
      const response = await this.sdk.boxType.find();

      if(!response.count)
        return [];

      return response.rows;

    } catch (error) {
      logger.error('Error fetching box types from Ozmap:', error instanceof Error ? error.message : error);
      throw new Error('Failed to fetch box types from Ozmap API');
    }
  }

  async save(data: BoxType): Promise<boolean> {
    return false;
  }
}
