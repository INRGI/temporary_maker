import { Module } from "@nestjs/common";
import { BroadcastModule } from "./broadcast/broadcast.module";
import { PriorityProductsModule } from "./priority-products/priority-products.module";
import { CopyModule } from "./copy/copy.module";
import { CopyParserModule } from "./copy-parser/copy-parser.module";

@Module({
  imports: [BroadcastModule, PriorityProductsModule, CopyModule, CopyParserModule],
  controllers: [],
  providers: [],
  exports: [BroadcastModule, PriorityProductsModule, CopyModule, CopyParserModule],
})
export class FinancesModule {}
