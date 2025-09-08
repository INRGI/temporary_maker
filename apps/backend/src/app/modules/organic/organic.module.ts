import { Module } from "@nestjs/common";
import { BroadcastModule } from "./broadcast/broadcast.module";
import { CopyModule } from "./copy/copy.module";
import { PriorityProductsModule } from "./priority-products/priority-products.module";

@Module({
  imports: [BroadcastModule, CopyModule, PriorityProductsModule],
  exports: [],
})
export class OrganicModule {}
