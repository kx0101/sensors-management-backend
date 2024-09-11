import { model, Schema, type InferSchemaType } from "mongoose";

const bellSchema = new Schema({
	status: {
		type: Boolean,
		unique: false,
		required: true,
	},
});

<<<<<<< HEAD
export type Bell = InferSchemaType<typeof bellSchema>
export const BellRepo = model('Bell', bellSchema)
=======
export type Bell = InferSchemaType<typeof bellSchema>;
export const Bell = model("Bell", bellSchema);
>>>>>>> c9572c17e8b9e6eb730f997677a40bd7347b8ea5
