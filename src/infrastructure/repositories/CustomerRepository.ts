import { IRepository } from './IRepository';
import { CustomerDTO } from '../datasources/customer/CustomerDTO';
import { Customer } from '../../domain/entities/Customer';
import { IDataSource } from '../datasources/IDataSource';
import logger from '../../shared/utils/logger';

export class CustomerRepository implements IRepository<Customer> {
  private data: Customer[] = [];
  private apiDataSource: IDataSource<CustomerDTO>;
  private mongoDataSource: IDataSource<Customer>;

  constructor(
    mongoDataSource: IDataSource<Customer>,
    apiDataSource: IDataSource<CustomerDTO>
  ) {
    this.apiDataSource = apiDataSource;
    this.mongoDataSource = mongoDataSource;
  }

  async getData(): Promise<Customer[]> {
    const dtos = await this.apiDataSource.getData();
    this.data = dtos.map(dto => new Customer({
      id: dto.id,
      code: dto.code,
      name: dto.name,
      address: dto.address,
      box_id: dto.box_id,
    }));
    return this.data;
  }

  async save(): Promise<boolean> {
    for (const item of this.data) {
      try {
        await this.mongoDataSource.save(item);
      } catch (error) {
        logger.error(`Erro ao salvar customer ${item.code} no MongoDB:`, error);
      }
    }
    return true;
  }

  async get(obj: Customer): Promise<Customer | null> {
    return await this.mongoDataSource.get(obj);
  }
}