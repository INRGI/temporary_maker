import { Injectable } from '@nestjs/common';
import { MondayConfigService } from '@epc-services/core';
import { MondayApiModuleOptions } from '@epc-services/monday-api';
@Injectable()
export class OGMondayApiOptionsFactoryService {
  constructor(private readonly mondayApiConfig: MondayConfigService) {}

  create(): Promise<MondayApiModuleOptions> | MondayApiModuleOptions {
    return {
      accessToken: this.mondayApiConfig.ogAccessToken,
    };
  }
}
