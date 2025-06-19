import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BroadcastRules, BroadcastRulesSchema } from '../../schemas/broadcast-rules.schema';
import { BroadcastRulesRepository } from './broadcast-rules.repository';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: BroadcastRules.name, schema: BroadcastRulesSchema },
    ]),
  ],
  providers: [BroadcastRulesRepository],
  exports: [BroadcastRulesRepository],
})
export class BroadcastRulesRepositoryModule {}