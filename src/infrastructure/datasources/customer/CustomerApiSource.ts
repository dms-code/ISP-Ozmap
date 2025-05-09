import axios from 'axios';
import { IDataSource } from '../IDataSource';
import { CustomerDTO } from './CustomerDTO';
import { EnvConfig } from '../../../shared/config/env';
import logger from '../../../shared/utils/logger';

export class CustomerApiSource implements IDataSource<CustomerDTO> {
  async get(data: CustomerDTO): Promise<CustomerDTO | null> {
    return null;
  }
  async getData(): Promise<CustomerDTO[]> {
    const baseUrl = EnvConfig.getIspServerUrl();
    const customersEndpoint = EnvConfig.getIspCustomersEndpoint();
    const url = `${baseUrl}${customersEndpoint}`;
    logger.info(`Chamando API: ${url}`);
    try {
      const response = await axios.get(url);
      return (response.data as any[]).map(obj => new CustomerDTO().fromJson(obj));
    } catch (error) {
      logger.error('Erro ao buscar clientes do ISP API:', error);
      return [];
    }
  }

  async save(data: CustomerDTO): Promise<boolean> {
    return true;
  }
}
