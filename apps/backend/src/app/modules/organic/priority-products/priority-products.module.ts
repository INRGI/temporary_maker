import { GdriveConfigModule } from "@epc-services/core";
import { GDriveApiModule } from "@epc-services/gdrive-api";
import { Module } from "@nestjs/common";
import {
  applicationProviders,
  messageControllers,
  serviceProviders,
} from "./priority-products.providers";
import { GSpreadsheetApiModule } from "@epc-services/gspreadsheet-api";
import { CacheModule } from "@nestjs/cache-manager";
import { OrganicGdriveApiOptionsFactoryService } from "../../../infrastructure/options-factory/organic-gdrive-api.options-factory.service";

@Module({
  imports: [
    GDriveApiModule.registerAsync({
      imports: [GdriveConfigModule],
      useClass: OrganicGdriveApiOptionsFactoryService,
    }),
    GSpreadsheetApiModule.registerAsync({
      imports: [GdriveConfigModule],
      useClass: OrganicGdriveApiOptionsFactoryService,
    }),
    CacheModule.register({
      ttl: 900000,
      isGlobal: true,
    }),
  ],
  controllers: [...messageControllers],
  providers: [...serviceProviders, ...applicationProviders],
  exports: [...applicationProviders, ...serviceProviders],
})
export class PriorityProductsModule {}
