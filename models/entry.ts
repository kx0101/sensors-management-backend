import {model, Schema, type InferSchemaType } from 'mongoose'

const entrySchema = new Schema({
    address: {
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
      expireAt:{
        type: Date,
        expires: 86400,
        required: true,
      },
      
},{timestamps: true})

export type Entry = InferSchemaType<typeof entrySchema>
export const EntryRepo = model('Entry', entrySchema)