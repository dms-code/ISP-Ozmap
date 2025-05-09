import { IRepository } from './IRepository';
import { BoxDTO } from '../datasources/box/BoxDTO';
import { IDataSource } from '../datasources/IDataSource';
import { Box } from '../../domain/entities/Box';
import logger from '../../shared/utils/logger';

export class BoxRepository implements IRepository<Box> {
  private data: Box[] = [];
  private apiDataSource?: IDataSource<BoxDTO>;
  private mongoDataSource: IDataSource<Box>;

  constructor(mongoDataSource: IDataSource<Box>, apiDataSource?: IDataSource<BoxDTO>) {
    this.mongoDataSource = mongoDataSource;
    this.apiDataSource = apiDataSource;
  }

  async getData(): Promise<Box[]> {
    if (this.apiDataSource) {
      const dtos = await this.apiDataSource.getData();
      this.data = dtos.map(dto => new Box({
        id: dto.id,
        name: dto.name,
        type: dto.type,
        lat: dto.lat,
        lng: dto.lng,
      }));
      return this.data;
    } else {
      // Busca do mongo se não houver API
      const boxes = await this.mongoDataSource.getData();
      this.data = boxes;
      return this.data;
    }
  }

  async save(): Promise<boolean> {
    for (const item of this.data) {
      try {
        await this.mongoDataSource.save(item);
      } catch (error) {
        logger.error(`Erro ao salvar box ${item.name} no MongoDB:`, error);
      }
    }
    return true;
  }

  async get(obj: Box): Promise<Box | null> {
    return await this.mongoDataSource.get(obj);
  }
}
