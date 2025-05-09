import { IDataSource } from '../IDataSource';
import { DropCableDTO } from './DropCableDTO';
import axios from 'axios';
import { EnvConfig } from '../../../shared/config/env';
import logger from '../../../shared/utils/logger';

export class DropCableApiSource implements IDataSource<DropCableDTO> {
  async get(data: DropCableDTO): Promise<DropCableDTO | null> {
    return null;
  }
  async getData(): Promise<DropCableDTO[]> {
    try {
      const baseUrl = EnvConfig.getIspServerUrl();
      const endpoint = EnvConfig.getIspDropCablesEndpoint();
      const url = `${baseUrl}${endpoint}`;
      logger.info(`Chamando API: ${url}`);
      const response = await axios.get(url);
      return Array.isArray(response.data)
        ? response.data.map((json: any) => new DropCableDTO().fromJson(json))
        : [];
    } catch (error) {
      logger.error('Erro ao buscar drop cables do ISP API:', error);
      return [];
    }
  }

  async save(data: DropCableDTO): Promise<boolean> {
    return true;
  }
}
