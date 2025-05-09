import { IDataSource } from '../IDataSource';
import { CableDTO } from './CableDTO';
import axios from 'axios';
import { EnvConfig } from '../../../shared/config/env';
import logger from '../../../shared/utils/logger';

export class CableApiSource implements IDataSource<CableDTO> {
  async get(data: CableDTO): Promise<CableDTO | null> {
    return null;
  }
  async getData(): Promise<CableDTO[]> {
    try {
      const baseUrl = EnvConfig.getIspServerUrl();
      const endpoint = EnvConfig.getIspCablesEndpoint();
      const url = `${baseUrl}${endpoint}`;
      logger.info(`Chamando API: ${url}`);
      const response = await axios.get(url);
      return Array.isArray(response.data)
        ? response.data.map((json: any) => new CableDTO().fromJson(json))
        : [];
    } catch (error) {
      logger.error('Erro ao buscar cabos do ISP API:', error);
      return [];
    }
  }

  async save(data: CableDTO): Promise<boolean> {
    return true;
  }
}
