import { Injectable } from '@nestjs/common';
import { GdriveConfigService } from '@epc-services/core';
import { GDriveApiModuleOptions } from '@epc-services/gdrive-api';
@Injectable()
export class OrganicGdriveApiOptionsFactoryService {
  constructor(private readonly gdriveApiConfig: GdriveConfigService) {}

  create(): Promise<GDriveApiModuleOptions> | GDriveApiModuleOptions {
    return {
      client_email: this.gdriveApiConfig.organicGdriveClientEmail,
      private_key: this.gdriveApiConfig.organicGdrivePrivateKey.split('\\n').join('\n'),
    };
  }
}
