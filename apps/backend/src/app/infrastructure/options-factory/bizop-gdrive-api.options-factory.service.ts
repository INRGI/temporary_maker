import { Injectable } from '@nestjs/common';
import { GdriveConfigService } from '@epc-services/core';
import { GDriveApiModuleOptions } from '@epc-services/gdrive-api';
@Injectable()
export class BizopGdriveApiOptionsFactoryService {
  constructor(private readonly gdriveApiConfig: GdriveConfigService) {}

  create(): Promise<GDriveApiModuleOptions> | GDriveApiModuleOptions {
    return {
      client_email: this.gdriveApiConfig.bizopGdriveClientEmail,
      private_key: this.gdriveApiConfig.bizopGdrivePrivateKey.split('\\n').join('\n'),
    };
  }
}
