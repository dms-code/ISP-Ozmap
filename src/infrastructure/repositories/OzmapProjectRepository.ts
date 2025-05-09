import { IRepository } from './IRepository';
import logger from '../../shared/utils/logger';
import { Customer } from '../../domain/entities/Customer';
import OZMapSDK from '@ozmap/ozmap-sdk';
import { CustomerMongoSource } from '../datasources/customer/CustomerMongoSource';
import { MongoDbManager } from '../database/MongoDbManager';
import { EnvConfig } from '../../shared/config/env';
import { DropCable } from '../../domain/entities/DropCable';
import { ProjectOzmapSource } from '../../infrastructure/datasources/drop_cable/ProjectOzmapSource';
import { DropCableMongoSource } from '../../infrastructure/datasources/drop_cable/DropCableMongoSource';
import { BoxMongoSource } from '../../infrastructure/datasources/box/BoxMongoSource';
import { CreateProjectDTO } from '@ozmap/ozmap-sdk';
import { BoxOzmapSource } from '../../infrastructure/datasources/box/BoxOzmapSource';

export class OzmapProjectRepository implements IRepository<DropCable> {
    private projectSource: ProjectOzmapSource;
    private dropCableMongoSource: DropCableMongoSource;
    private boxSource: BoxMongoSource;
    private customerSource : CustomerMongoSource;
    private boxOzmapSource: BoxOzmapSource;

    constructor() {
        const baseUrl = EnvConfig.getOzmapApiBaseUrl();
        const apiKey = EnvConfig.getOzmapApiKey();
        const sdk = new OZMapSDK(baseUrl, { apiKey });
        this.projectSource = new ProjectOzmapSource(sdk);
        const mongoDbManager = new MongoDbManager();
        this.dropCableMongoSource = new DropCableMongoSource(mongoDbManager);
        this.boxSource = new BoxMongoSource(mongoDbManager);
        this.customerSource = new CustomerMongoSource(mongoDbManager);
        this.boxOzmapSource = new BoxOzmapSource(sdk);
    }


    async getData(): Promise<DropCable[]> {
        return [];
    }

    async get(obj: DropCable): Promise<DropCable | null> {
        return await this.dropCableMongoSource.get(obj);
    }

    async save(data: DropCable): Promise<boolean> {
        logger.info('Salvando drop cable como projeto no Ozmap (save)', data);

        const customer = Customer.fromJson({id: data.customer_id});
    
        const customerData = await this.customerSource.get(customer);

        if (!customerData) {
            logger.error('Cliente não encontrado');
            return false;
        }

        logger.info(customerData);

        const projectDto: CreateProjectDTO = {
            name: data.name,
            external_id: data.id,
            identifier: customerData.ozmapData?.id,
            lng: 0,
            lat: 0        
        };

        const project = await this.projectSource.saveProject(projectDto);

        if (!project) {
            logger.error('Erro ao salvar projeto no Ozmap');
            return false;
        }

        data.ozmapData = project;

        const saved = await this.dropCableMongoSource.save(data);

        if (!saved) {
            logger.error('Erro ao salvar drop cable no MongoDB');
            return false;
        }

        return true;
    }
}

