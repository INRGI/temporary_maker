import { GdriveConfigModule } from '@epc-services/core';
import { GDriveApiModule } from '@epc-services/gdrive-api';
import { Module } from '@nestjs/common';
import { GdriveApiOptionsFactoryService } from '../../../infrastructure/options-factory/gdrive-api.options-factory.service';
import { applicationProviders, messageControllers, serviceProviders } from './broadcast.providers';

@Module({
  imports: [
    GDriveApiModule.registerAsync({
      imports: [GdriveConfigModule],
      useClass: GdriveApiOptionsFactoryService,
    }),
  ],
  controllers: [...messageControllers],
  providers: [...serviceProviders, ...applicationProviders],
  exports: [...applicationProviders, ...serviceProviders],
})
export class BroadcastModule {}
