import { GdriveConfigModule } from "@epc-services/core";
import { GDriveApiModule } from "@epc-services/gdrive-api";
import { Module } from "@nestjs/common";
import { GdriveApiOptionsFactoryService } from "../../../infrastructure/options-factory/gdrive-api.options-factory.service";
import {
  applicationProviders,
  messageControllers,
  serviceProviders,
} from "./priority-products.providers";
import { GSpreadsheetApiModule } from "@epc-services/gspreadsheet-api";
import { CacheModule } from "@nestjs/cache-manager";

@Module({
  imports: [
    GDriveApiModule.registerAsync({
      imports: [GdriveConfigModule],
      useClass: GdriveApiOptionsFactoryService,
    }),
    GSpreadsheetApiModule.registerAsync({
      imports: [GdriveConfigModule],
      useClass: GdriveApiOptionsFactoryService,
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
