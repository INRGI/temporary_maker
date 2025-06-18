import { Module } from "@nestjs/common";
import {
  appProviders,
  httpControllers,
} from "./broadcast-tool-finances.providers";
import { BigQueryModule } from "./bigQuery/bigQuery.module";
import { PriorityModule } from "./priority/priority.module";

@Module({
  imports: [BigQueryModule, PriorityModule],
  providers: [...appProviders],
  controllers: [...httpControllers],
})
export class BroadcastToolFinancesModule {}
