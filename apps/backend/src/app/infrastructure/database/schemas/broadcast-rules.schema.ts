import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";
import {
  UsageRules,
  TestingRules,
  DomainRules,
  PartnerRules,
  ProductRules,
  CopyAssignmentStrategyRules,
} from "@epc-services/interface-adapters";

@Schema({ collection: "broadcast_rules", timestamps: true })
export class BroadcastRules extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  broadcastSpreadsheetId: string;

  @Prop({ type: Object, required: true })
  usageRules: UsageRules;

  @Prop({ type: Object, required: true })
  testingRules: TestingRules;

  @Prop({ type: Object, required: true })
  domainRules: DomainRules;

  @Prop({ type: Object, required: true })
  partnerRules: PartnerRules;

  @Prop({ type: Object, required: true })
  productRules: ProductRules;

  @Prop({ type: Object, required: true })
  copyAssignmentStrategyRules: CopyAssignmentStrategyRules;
}

export const BroadcastRulesSchema =
  SchemaFactory.createForClass(BroadcastRules);
