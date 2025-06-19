import { Module } from "@nestjs/common";
import {
  appProviders,
  httpControllers,
} from "./broadcast-tool-finances.providers";
import { BigQueryModule } from "./bigQuery/bigQuery.module";
import { PriorityModule } from "./priority/priority.module";
import { MondayModule } from "./monday/monday.module";
import { RulesModule } from "./rules/rules.module";

@Module({
  imports: [BigQueryModule, PriorityModule, MondayModule, RulesModule],
  providers: [...appProviders],
  controllers: [...httpControllers],
})
export class BroadcastToolFinancesModule {}
