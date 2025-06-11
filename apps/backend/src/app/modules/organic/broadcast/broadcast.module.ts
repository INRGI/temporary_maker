import { GDriveApiModule } from "@epc-services/gdrive-api";
import { GSpreadsheetApiModule } from "@epc-services/gspreadsheet-api";
import { Module } from "@nestjs/common";
import { applicationProviders, messageControllers, serviceProviders } from "./broadcast.providers";

@Module({
  imports: [
    // GDriveApiModule.registerAsync({
    //   imports: [GdriveConfigModule],
    //   useClass: HealthGdriveApiOptionsFactoryService,
    // }),
    // GSpreadsheetApiModule.registerAsync({
    //       imports: [GdriveConfigModule],
    //       useClass: HealthGdriveApiOptionsFactoryService,
    //     })
  ],
  controllers: [...messageControllers],
  providers: [...serviceProviders, ...applicationProviders],
  exports: [...applicationProviders, ...serviceProviders],
})
export class BroadcastModule {}