import { OzmapProspectRepository } from '../../infrastructure/repositories/OzmapProspectRepository';
import { IspSyncService } from '../../infrastructure/services/IspSyncService';
import { OzmapSyncService } from '../../infrastructure/services/OzmapSyncService';

export class RunServicesUseCase {
  static start(): Promise<any[]> {

    return Promise.all([
      IspSyncService.sync(),
      OzmapSyncService.sync()
    ]);
  }

  static stop() {
    IspSyncService.cancel();
    OzmapSyncService.cancel();
  }
}
