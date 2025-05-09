import { IDataSource } from '../IDataSource';
import logger from '../../../shared/utils/logger';
import OZMapSDK, { CreateProjectDTO,Project } from '@ozmap/ozmap-sdk';

export class ProjectOzmapSource implements IDataSource<Project> {
  
  private sdk: OZMapSDK;

  constructor(sdk: OZMapSDK) {
    this.sdk = sdk;
  }

  async get(data: Project): Promise<Project | null> {
    return null;
  }

  async getData(): Promise<Project[]> {
    return [];
  }

  async save(data: Project): Promise<boolean> {
    return true;
  }

  async saveProject(data: CreateProjectDTO): Promise<Project | null> {
    try {
      const response = await this.sdk.project.create(data);
      return response;
    } catch (error) {
      logger.error('Erro ao salvar prospect no Ozmap:', error instanceof Error ? error.message : error);
      return null;
    }
  }
}

