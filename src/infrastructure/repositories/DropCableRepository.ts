import { IRepository } from './IRepository';
import { DropCableDTO } from '../datasources/drop_cable/DropCableDTO';
import { IDataSource } from '../datasources/IDataSource';
import { DropCable } from '../../domain/entities/DropCable';
import logger from '../../shared/utils/logger';

export class DropCableRepository implements IRepository<DropCable> {
  private data: DropCable[] = [];
  private apiDataSource: IDataSource<DropCableDTO>;
  private mongoDataSource: IDataSource<DropCable>;

  constructor(mongoDataSource: IDataSource<DropCable>, apiDataSource: IDataSource<DropCableDTO>) {
    this.apiDataSource = apiDataSource;
    this.mongoDataSource = mongoDataSource;
  }

  async getData(): Promise<DropCable[]> {
    try {
      const dtos = await this.apiDataSource.getData();

      this.data = dtos.map(dto => new DropCable({
        id: dto.id,
        name: dto.name,
        box_id: dto.box_id,
        customer_id: dto.customer_id,
      }));
    } catch (error) {
      logger.error('Erro ao buscar drop cables do ISP API:', error);
      this.data = [];
    }
    return this.data;
  }

  async save(): Promise<boolean> {
    for (const item of this.data) {
      try {
        await this.mongoDataSource.save(item);
      } catch (error) {
        logger.error(`Erro ao salvar drop cable ${item.name} no MongoDB:`, error);
      }
    }
    return true;
  }

  async get(obj: DropCable): Promise<DropCable | null> {
    return await this.mongoDataSource.get(obj);
  }
}
