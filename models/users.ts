import {model, Schema, type InferSchemaType } from 'mongoose'

const userSchema = new Schema({
    _id: {
        type: Schema.Types.ObjectId,
        unique: true,
        required: true
    },
    username: {
        type: String,
        unique: false,
        required: true
    },
    password: {
        type: String,
        unique: false,
        required: true
    },
    role: {
        type: String,
        unique: false,
        required: true
    }
})

export type User = InferSchemaType<typeof userSchema>
export const User = model('User', userSchema)