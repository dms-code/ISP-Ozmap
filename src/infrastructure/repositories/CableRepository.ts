import { IRepository } from './IRepository';
import { CableDTO } from '../datasources/cable/CableDTO';
import { IDataSource } from '../datasources/IDataSource';
import { Cable } from '../../domain/entities/Cable';
import logger from '../../shared/utils/logger';

export class CableRepository implements IRepository<Cable> {
  private data: Cable[] = [];
  private apiDataSource?: IDataSource<CableDTO>;
  private mongoDataSource: IDataSource<Cable>;

  constructor(mongoDataSource: IDataSource<Cable>, apiDataSource?: IDataSource<CableDTO>) {
    this.mongoDataSource = mongoDataSource;
    this.apiDataSource = apiDataSource;
  }

  async getData(): Promise<Cable[]> {
    if (this.apiDataSource) {
      const dtos = await this.apiDataSource.getData();
      this.data = dtos.map(dto => new Cable({
        id: dto.id,
        name: dto.name,
        capacity: dto.capacity,
        boxes_connected: dto.boxes_connected,
        path: dto.path,
      }));
      return this.data;
    } else {
      // Busca do mongo se não houver API
      const cables = await this.mongoDataSource.getData();
      this.data = cables;
      return this.data;
    }
  }

  async save(): Promise<boolean> {
    for (const item of this.data) {
      try {
        await this.mongoDataSource.save(item);
      } catch (error) {
        logger.error(`Erro ao salvar cable ${item.name} no MongoDB:`, error);
      }
    }
    return true;
  }

  async get(obj: Cable): Promise<Cable | null> {
    return await this.mongoDataSource.get(obj);
  }
}
