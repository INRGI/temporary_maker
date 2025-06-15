import { GDriveApiModule } from "@epc-services/gdrive-api";
import { GSpreadsheetApiModule } from "@epc-services/gspreadsheet-api";
import { Module } from "@nestjs/common";
import {
  applicationProviders,
  messageControllers,
  serviceProviders,
} from "./broadcast.providers";
import { GdriveConfigModule } from "@epc-services/core";
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
  ],
  controllers: [...messageControllers],
  providers: [...serviceProviders, ...applicationProviders],
  exports: [...applicationProviders, ...serviceProviders],
})
export class BroadcastModule {}
