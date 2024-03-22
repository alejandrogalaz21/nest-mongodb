import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document } from 'mongoose'

@Schema({ timestamps: true })
export class Pokemon extends Document {
  // id: string // Mongo me lo da
  @Prop({
    type: String,
    index: true,
    unique: true
  })
  name: string

  @Prop({
    type: Number,
    index: true,
    unique: true
  })
  no: number
}

export const PokemonSchema = SchemaFactory.createForClass(Pokemon)
