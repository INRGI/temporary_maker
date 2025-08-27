import { Module } from "@nestjs/common";
import { BroadcastModule } from "./broadcast/broadcast.module";
import { CopyModule } from "./copy/copy.module";

@Module({
  imports: [BroadcastModule, CopyModule],
  exports: [],
})
export class BizopModule {}
