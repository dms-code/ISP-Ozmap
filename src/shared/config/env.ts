export class EnvConfig {
  static readonly MONGO_URI: string = process.env.MONGO_URI || 'mongodb://localhost:27017/';
  static readonly MONGO_DB: string = process.env.MONGO_DB || 'isp_ozmap';
  static readonly OZMAP_API_KEY: string = process.env.OZMAP_API_KEY || '';
  static readonly ISP_SERVER_URL: string = process.env.ISP_SERVER_URL || 'http://localhost:4000';
  static readonly ISP_REQUESTS_PER_MINUTE: number = process.env.ISP_REQUESTS_PER_MINUTE ? parseInt(process.env.ISP_REQUESTS_PER_MINUTE, 10) : 50;
  static readonly ISP_REQUESTS_DELAY_SECONDS: number = process.env.ISP_REQUESTS_DELAY_SECONDS ? parseInt(process.env.ISP_REQUESTS_DELAY_SECONDS, 10) : 10;

  static readonly ISP_CUSTOMERS_ENDPOINT: string = process.env.ISP_CUSTOMERS_ENDPOINT || '/customers';
  static readonly ISP_CABLES_ENDPOINT: string = process.env.ISP_CABLES_ENDPOINT || '/cables';
  static readonly ISP_DROP_CABLES_ENDPOINT: string = process.env.ISP_DROP_CABLES_ENDPOINT || '/drop_cables';
  static readonly ISP_BOXES_ENDPOINT: string = process.env.ISP_BOXES_ENDPOINT || '/boxes';

  static readonly OZMAP_BOXES_ENDPOINT: string = process.env.OZMAP_BOXES_ENDPOINT || '/boxes';

  static readonly OZMAP_API_BASE_URL: string = process.env.OZMAP_API_BASE_URL || 'https://api.ozmap.com.br/v2';

  static readonly REDIS_PORT: number = process.env.REDIS_PORT ? parseInt(process.env.REDIS_PORT, 10) : 6379;
  static readonly REDIS_HOST: string = process.env.REDIS_HOST || 'localhost';
  static readonly REDIS_TIMEOUT: number = 5000;

  static getOzmapApiKey(): string {
    return EnvConfig.OZMAP_API_KEY;
  }

  static getIspServerUrl(): string {
    return EnvConfig.ISP_SERVER_URL;
  }

  static getIspRequestsPerMinute(): number {
    return EnvConfig.ISP_REQUESTS_PER_MINUTE;
  }

  static getIspRequestsDelaySeconds(): number {
    return EnvConfig.ISP_REQUESTS_DELAY_SECONDS;
  }

  static getIspCustomersEndpoint(): string {
    return EnvConfig.ISP_CUSTOMERS_ENDPOINT;
  }

  static getIspCablesEndpoint(): string {
    return EnvConfig.ISP_CABLES_ENDPOINT;
  }

  static getIspDropCablesEndpoint(): string {
    return EnvConfig.ISP_DROP_CABLES_ENDPOINT;
  }

  static getIspBoxesEndpoint(): string {
    return EnvConfig.ISP_BOXES_ENDPOINT;
  }

  static getOzmapBoxesEndpoint(): string {
    return EnvConfig.OZMAP_BOXES_ENDPOINT;
  }

  static getOzmapApiBaseUrl(): string {
    return EnvConfig.OZMAP_API_BASE_URL;
  }

  static getMongoUri(): string {
    return EnvConfig.MONGO_URI;
  }
  static getMongoDb(): string {
    return EnvConfig.MONGO_DB;
  }

  static getRedisPort(): number {
    return EnvConfig.REDIS_PORT;
  }

  static getRedisHost(): string {
    return EnvConfig.REDIS_HOST;
  }

  static getRedisTimeout(): number {
    return EnvConfig.REDIS_TIMEOUT;
  }
}