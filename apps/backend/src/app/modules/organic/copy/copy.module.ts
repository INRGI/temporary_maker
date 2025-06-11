import { MondayApiModule } from "@epc-services/monday-api";
import { applicationProviders, messageControllers, serviceProviders } from "./copy.providers";
import { GdriveConfigModule, MondayConfigModule } from "@epc-services/core";
import { MondayApiOptionsFactoryService } from "../../../infrastructure/options-factory/monday-api.options-factory.service";
import { GDocApiModule } from "@epc-services/gdoc-api";
import { GDriveApiModule } from "@epc-services/gdrive-api";
import { BroadcastModule } from "../broadcast/broadcast.module";
import { Module } from "@nestjs/common";

@Module({
  imports: [
    BroadcastModule,
    // GDriveApiModule.registerAsync({
    //   imports: [GdriveConfigModule],
    //   useClass: HealthGdriveApiOptionsFactoryService,
    // }),
    MondayApiModule.registerAsync({
      imports: [MondayConfigModule],
      useClass: MondayApiOptionsFactoryService,
    }),
    // GDocApiModule.registerAsync({
    //   imports: [GdriveConfigModule],
    //   useClass: HealthGdriveApiOptionsFactoryService,
    // }),
  ],
  controllers: [...messageControllers],
  providers: [...serviceProviders, ...applicationProviders],
  exports: [...applicationProviders, ...serviceProviders],
})
export class CopyModule {}
