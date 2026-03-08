import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type PlayerDocument = HydratedDocument<Player>;

@Schema({ timestamps: true })
export class Player {
  id: string;

  @Prop({ unique: true, required: true })
  username: string;

  @Prop()
  avatarUrl: string;

  createdAt: Date;
}

export const PlayerSchema = SchemaFactory.createForClass(Player);

// Map _id to id in JSON output
PlayerSchema.set('toJSON', {
  virtuals: true,
  transform: (_doc: any, ret: any) => {
    ret.id = ret._id.toString();
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});
