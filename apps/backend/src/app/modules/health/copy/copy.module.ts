import { Module } from '@nestjs/common';
import { GDriveApiModule } from '@epc-services/gdrive-api';
import { MondayApiModule } from '@epc-services/monday-api';
import {
  GdriveConfigModule,
  MondayConfigModule,
} from '@epc-services/core';

import { BroadcastModule } from '../broadcast/broadcast.module';
import { MondayApiOptionsFactoryService } from '../../../infrastructure/options-factory/monday-api.options-factory.service';
import { applicationProviders, messageControllers, serviceProviders } from './copy.providers';
import { CopyParserModule } from '../../finances/copy-parser/copy-parser.module';
import { HealthGdriveApiOptionsFactoryService } from '../../../infrastructure/options-factory/health-gdrive-api.options-factory.service';
import { PriorityProductsModule } from '../priority-products/priority-products.module';

@Module({
  imports: [
    CopyParserModule,
    BroadcastModule,
    PriorityProductsModule,
    GDriveApiModule.registerAsync({
      imports: [GdriveConfigModule],
      useClass: HealthGdriveApiOptionsFactoryService,
    }),
    MondayApiModule.registerAsync({
      imports: [MondayConfigModule],
      useClass: MondayApiOptionsFactoryService,
    }),
  ],
  controllers: [...messageControllers],
  providers: [...serviceProviders, ...applicationProviders],
  exports: [...applicationProviders, ...serviceProviders],
})
export class CopyModule {}
