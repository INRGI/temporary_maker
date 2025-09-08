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
import { OrganicGdriveApiOptionsFactoryService } from "../../../infrastructure/options-factory/organic-gdrive-api.options-factory.service";
import { OGMondayApiOptionsFactoryService } from "../../../infrastructure/options-factory/organic-monday-api.options-factory.service";
import { CopyParserModule } from "../../finances/copy-parser/copy-parser.module";
import { PriorityProductsModule } from "../priority-products/priority-products.module";

@Module({
  imports: [
    BroadcastModule,
    CopyParserModule,
    PriorityProductsModule,
    GDriveApiModule.registerAsync({
      imports: [GdriveConfigModule],
      useClass: OrganicGdriveApiOptionsFactoryService,
    }),
    MondayApiModule.registerAsync({
      imports: [MondayConfigModule],
      useClass: OGMondayApiOptionsFactoryService,
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
