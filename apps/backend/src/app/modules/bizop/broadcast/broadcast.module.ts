import { GDriveApiModule } from "@epc-services/gdrive-api";
import { GSpreadsheetApiModule } from "@epc-services/gspreadsheet-api";
import { Module } from "@nestjs/common";
import {
  applicationProviders,
  messageControllers,
  serviceProviders,
} from "./broadcast.providers";
import { GdriveConfigModule } from "@epc-services/core";
import { BizopGdriveApiOptionsFactoryService } from "../../../infrastructure/options-factory/bizop-gdrive-api.options-factory.service";

@Module({
  imports: [
    GDriveApiModule.registerAsync({
      imports: [GdriveConfigModule],
      useClass: BizopGdriveApiOptionsFactoryService,
    }),
    GSpreadsheetApiModule.registerAsync({
      imports: [GdriveConfigModule],
      useClass: BizopGdriveApiOptionsFactoryService,
    }),
  ],
  controllers: [...messageControllers],
  providers: [...serviceProviders, ...applicationProviders],
  exports: [...applicationProviders, ...serviceProviders],
})
export class BroadcastModule {}
