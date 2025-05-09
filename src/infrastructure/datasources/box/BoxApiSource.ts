import { IDataSource } from '../IDataSource';
import { BoxDTO } from './BoxDTO';
import axios from 'axios';
import { EnvConfig } from '../../../shared/config/env';
import logger from '../../../shared/utils/logger';

export class BoxApiSource implements IDataSource<BoxDTO> {
  async get(data: BoxDTO): Promise<BoxDTO | null> {
    return null;
  }
  
  async getData(): Promise<BoxDTO[]> {
    try {
      const baseUrl = EnvConfig.getIspServerUrl();
      const endpoint = EnvConfig.getIspBoxesEndpoint();
      const url = `${baseUrl}${endpoint}`;
      logger.info(`Chamando API: ${url}`);
      const response = await axios.get(url);
      return Array.isArray(response.data)
        ? response.data.map((json: any) => new BoxDTO().fromJson(json))
        : [];
    } catch (error) {
      logger.error('Erro ao buscar boxes do ISP API:', error);
      return [];
    }
  }

  async save(data: BoxDTO): Promise<boolean> {
    return true;
  }
}
