import { MondayApiModule } from "@epc-services/monday-api";
import {
  applicationProviders,
  messageControllers,
  serviceProviders,
} from "./copy.providers";
import { GdriveConfigModule, MondayConfigModule } from "@epc-services/core";
import { GDocApiModule } from "@epc-services/gdoc-api";
import { GDriveApiModule } from "@epc-services/gdrive-api";
import { BroadcastModule } from "../broadcast/broadcast.module";
import { Module } from "@nestjs/common";
import { CopyParserModule } from "../../finances/copy-parser/copy-parser.module";
import { BizopGdriveApiOptionsFactoryService } from "../../../infrastructure/options-factory/bizop-gdrive-api.options-factory.service";
import { MondayApiOptionsFactoryService } from "../../../infrastructure/options-factory/monday-api.options-factory.service";

@Module({
  imports: [
    BroadcastModule,
    CopyParserModule,
    GDriveApiModule.registerAsync({
      imports: [GdriveConfigModule],
      useClass: BizopGdriveApiOptionsFactoryService,
    }),
    MondayApiModule.registerAsync({
      imports: [MondayConfigModule],
      useClass: MondayApiOptionsFactoryService,
    }),
    GDocApiModule.registerAsync({
      imports: [GdriveConfigModule],
      useClass: BizopGdriveApiOptionsFactoryService,
    }),
  ],
  controllers: [...messageControllers],
  providers: [...serviceProviders, ...applicationProviders],
  exports: [...applicationProviders, ...serviceProviders],
})
export class CopyModule {}
