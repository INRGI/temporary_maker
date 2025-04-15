import { GdriveConfigModule } from '@epc-services/core';
import { GDriveApiModule } from '@epc-services/gdrive-api';
import { Module } from '@nestjs/common';
import { applicationProviders, messageControllers, serviceProviders } from './priority-products.providers';
import { GSpreadsheetApiModule } from '@epc-services/gspreadsheet-api';
import { HealthGdriveApiOptionsFactoryService } from '../../../infrastructure/options-factory/health-gdrive-api.options-factory.service';

@Module({
  imports: [
    GDriveApiModule.registerAsync({
      imports: [GdriveConfigModule],
      useClass: HealthGdriveApiOptionsFactoryService,
    }),
    GSpreadsheetApiModule.registerAsync({
      imports: [GdriveConfigModule],
      useClass: HealthGdriveApiOptionsFactoryService,
    })
  ],
  controllers: [...messageControllers],
  providers: [...serviceProviders, ...applicationProviders],
  exports: [...applicationProviders, ...serviceProviders],
})
export class PriorityProductsModule {}
