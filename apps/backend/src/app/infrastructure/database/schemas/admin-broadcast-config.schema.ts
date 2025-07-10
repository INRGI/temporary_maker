import { AnalyticSelectionRules, TestingRules } from "@epc-services/interface-adapters";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

@Schema({ timestamps: true })
export class AdminBroadcastConfig extends Document {
  @Prop({ required: true })
  niche: string;

  @Prop({ type: Object, required: true })
  testingRules: TestingRules;

  @Prop({ type: Object, required: true })
  analyticSelectionRules: AnalyticSelectionRules;
}

export const AdminBroadcastConfigSchema =
  SchemaFactory.createForClass(AdminBroadcastConfig);
