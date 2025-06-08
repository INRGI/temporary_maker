import { Module } from "@nestjs/common";
import { BroadcastModule } from "./broadcast/broadcast.module";
import { CopyModule } from "./copy/copy.module";
import { CopyParserModule } from "../finances/copy-parser/copy-parser.module";

@Module({
  imports: [BroadcastModule, CopyModule, CopyParserModule],
  controllers: [],
  providers: [],
  exports: [BroadcastModule, CopyModule],
})
export class OrganicModule {}
