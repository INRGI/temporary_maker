import { MondayApiModule } from "@epc-services/monday-api";
import {
  applicationProviders,
  messageControllers,
  serviceProviders,
} from "./copy.providers";
import { GdriveConfigModule, MondayConfigModule } from "@epc-services/core";
import { MondayApiOptionsFactoryService } from "../../../infrastructure/options-factory/monday-api.options-factory.service";
import { GDocApiModule } from "@epc-services/gdoc-api";
import { GDriveApiModule } from "@epc-services/gdrive-api";
import { BroadcastModule } from "../broadcast/broadcast.module";
import { Module } from "@nestjs/common";
import { OrganicGdriveApiOptionsFactoryService } from "../../../infrastructure/options-factory/organic-gdrive-api.options-factory.service";

@Module({
  imports: [
    BroadcastModule,
    GDriveApiModule.registerAsync({
      imports: [GdriveConfigModule],
      useClass: OrganicGdriveApiOptionsFactoryService,
    }),
    MondayApiModule.registerAsync({
      imports: [MondayConfigModule],
      useClass: MondayApiOptionsFactoryService,
    }),
    GDocApiModule.registerAsync({
      imports: [GdriveConfigModule],
      useClass: OrganicGdriveApiOptionsFactoryService,
    }),
  ],
  controllers: [...messageControllers],
  providers: [...serviceProviders, ...applicationProviders],
  exports: [...applicationProviders, ...serviceProviders],
})
export class CopyModule {}
