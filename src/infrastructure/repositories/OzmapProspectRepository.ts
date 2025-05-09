import { IRepository } from './IRepository';
import logger from '../../shared/utils/logger';
import { OzmapProspectSource } from '../datasources/customer/OzmapProspectSource';
import { Customer } from '../../domain/entities/Customer';
import OZMapSDK, { CreateProspectDTO, Prospect } from '@ozmap/ozmap-sdk';
import { CustomerMongoSource } from '../datasources/customer/CustomerMongoSource';
import { MongoDbManager } from '../database/MongoDbManager';
import { EnvConfig } from '../../shared/config/env';

export class OzmapProspectRepository implements IRepository<Customer> {
    private prospectSource: OzmapProspectSource;
    private customerMongoSource: CustomerMongoSource;

    constructor() {
        const baseUrl = EnvConfig.getOzmapApiBaseUrl();
        const apiKey = EnvConfig.getOzmapApiKey();
        const sdk = new OZMapSDK(baseUrl, { apiKey });
        this.prospectSource = new OzmapProspectSource(sdk);
        const mongoDbManager = new MongoDbManager();
        this.customerMongoSource = new CustomerMongoSource(mongoDbManager);
    }


    async getData(): Promise<Customer[]> {
        return [];
    }

    async get(obj: Customer): Promise<Customer | null> {
        return await this.customerMongoSource.get(obj);
    }

    async save(data: Customer): Promise<boolean> {
        logger.info('Salvando customer como prospect no Ozmap (save)', data);

        // Convert Customer para Prospect
        const createProspectDto: CreateProspectDTO = {
            name: data.name,
            address: data.address,
            code: data.code,
            external_id: data.id,
            tags: [data.box_id.toString()],
        };

        // Salvar prospect no Ozmap
        const prospect: Prospect | null = await this.prospectSource.saveProspect(createProspectDto);
        if (!prospect) {
            logger.error('Erro ao salvar prospect no Ozmap (SDK retornou null)');
            return false;
        }

        // Atualizar campo ozmapData do customer
        data.ozmapData = prospect;

        // Atualizar customer no MongoDB
        const mongoResult = await this.customerMongoSource.save(data);
        if (!mongoResult) {
            logger.error('Erro ao atualizar customer no MongoDB após salvar no Ozmap');
            return false;
        }

        logger.info('Cliente salvo com sucesso no Ozmap e MongoDB');
        return true;
    }
}

