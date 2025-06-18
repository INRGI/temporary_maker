import { Module } from "@nestjs/common";
import {
  applicationProviders,
  messageControllers,
  serviceProviders,
} from "./bigQuery.providers";
import { BigQueryApiModule } from "@epc-services/bigquery-api";
import { BigQueryConfigModule } from "@epc-services/core";
import { BigQueryApiOptionsFactoryService } from "../../../infrastructure/options-factory/bigquery-api.options-factory.service";

@Module({
  imports: [
    BigQueryApiModule.registerAsync({
      imports: [BigQueryConfigModule],
      useClass: BigQueryApiOptionsFactoryService,
    }),
  ],
  controllers: [...messageControllers],
  providers: [...serviceProviders, ...applicationProviders],
  exports: [...applicationProviders, ...serviceProviders],
})
export class BigQueryModule {}
