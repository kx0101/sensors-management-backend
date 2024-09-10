import { model, Schema, type InferSchemaType } from 'mongoose'

const alarmSchema = new Schema({
    address:{
        type: String,
        unique: false,
        required: true
    },
    sensor: {
        type: Number,
        unique: false,
        required: true
      },
      value: {
        type: Number,
        unique: false,
        required: true
      },
      reason: {
        type: String,
        unique: false,
        required: false
      },
      aknowledged: {
        type: Boolean,
        unique: false,
        required: false
      }
      
},{
  timestamps: true,
  expires: 24 * 60 * 60 * 1000,
})

export type Alarm = InferSchemaType<typeof alarmSchema>
export const Alarm = model('Alarm', alarmSchema)