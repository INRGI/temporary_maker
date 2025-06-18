import { Module } from "@nestjs/common";
import {
  appProviders,
  httpControllers,
} from "./broadcast-tool-finances.providers";
import { BigQueryModule } from "./bigQuery/bigQuery.module";

@Module({
  imports: [BigQueryModule],
  providers: [...appProviders],
  controllers: [...httpControllers],
})
export class BroadcastToolFinancesModule {}
