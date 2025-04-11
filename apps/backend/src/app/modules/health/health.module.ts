import { Module } from "@nestjs/common";
import { CopyParserModule } from "../finances/copy-parser/copy-parser.module";
import { BroadcastModule } from "./broadcast/broadcast.module";
import { CopyModule } from "./copy/copy.module";

@Module({
  imports: [CopyParserModule, BroadcastModule, CopyModule],
  exports: [],
})
export class HealthModule {}
