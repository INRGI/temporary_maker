import { Module } from "@nestjs/common";
import { BroadcastModule } from "./broadcast/broadcast.module";
import { PriorityProductsModule } from "./priority-products/priority-products.module";
import { CopyModule } from "./copy/copy.module";

@Module({
  imports: [BroadcastModule, PriorityProductsModule, CopyModule],
  controllers: [],
  providers: [],
  exports: [BroadcastModule, PriorityProductsModule, CopyModule],
})
export class FinancesModule {}
