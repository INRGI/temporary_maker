import { Module } from "@nestjs/common";
import { GDriveApiModule } from "@epc-services/gdrive-api";
import { MondayApiModule } from "@epc-services/monday-api";
import { GdriveConfigModule, MondayConfigModule } from "@epc-services/core";
import { CopyParserModule } from "../copy-parser/copy-parser.module";
import { BroadcastModule } from "../broadcast/broadcast.module";
import { PriorityProductsModule } from "../priority-products/priority-products.module";
import { GdriveApiOptionsFactoryService } from "../../../infrastructure/options-factory/gdrive-api.options-factory.service";
import { MondayApiOptionsFactoryService } from "../../../infrastructure/options-factory/monday-api.options-factory.service";
import {
  applicationProviders,
  messageControllers,
  serviceProviders,
} from "./copy.providers";
import { GDocApiModule } from "@epc-services/gdoc-api";
import { CacheModule } from "@nestjs/cache-manager";
import { GSpreadsheetApiModule } from "@epc-services/gspreadsheet-api";

@Module({
  imports: [
    CopyParserModule,
    BroadcastModule,
    PriorityProductsModule,
    GDriveApiModule.registerAsync({
      imports: [GdriveConfigModule],
      useClass: GdriveApiOptionsFactoryService,
    }),
    MondayApiModule.registerAsync({
      imports: [MondayConfigModule],
      useClass: MondayApiOptionsFactoryService,
    }),
    GDocApiModule.registerAsync({
      imports: [GdriveConfigModule],
      useClass: GdriveApiOptionsFactoryService,
    }),
    CacheModule.register({
      ttl: 600000,
      isGlobal: true,
    }),
    GSpreadsheetApiModule.registerAsync({
      imports: [GdriveConfigModule],
      useClass: GdriveApiOptionsFactoryService,
    }),
  ],
  controllers: [...messageControllers],
  providers: [...serviceProviders, ...applicationProviders],
  exports: [...applicationProviders, ...serviceProviders],
})
export class CopyModule {}
