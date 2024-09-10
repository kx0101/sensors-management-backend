import { model, Schema, type InferSchemaType } from 'mongoose'

const bellSchema = new Schema({
    status: {
        type: Boolean,
        unique: false,
        required: true
    }
})

export type Bell = InferSchemaType<typeof bellSchema>
export const Bell = model('Bell', bellSchema)