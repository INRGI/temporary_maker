import { Module } from "@nestjs/common";
import { CopyParserModule } from "../finances/copy-parser/copy-parser.module";
import { BroadcastModule } from "./broadcast/broadcast.module";
import { CopyModule } from "./copy/copy.module";
import { PriorityProductsModule } from "./priority-products/priority-products.module";
import { ImageUploadModule } from "./image-upload/image-upload.module";

@Module({
  imports: [CopyParserModule, BroadcastModule, CopyModule, PriorityProductsModule, ImageUploadModule],
  exports: [],
})
export class HealthModule {}
