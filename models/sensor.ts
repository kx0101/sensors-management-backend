import { model, Schema, type InferSchemaType } from "mongoose";

const sensorSchema = new Schema({
	_id: {
		type: Schema.Types.ObjectId,
		auto: true,
	},
	name: {
		type: String,
		unique: false,
		required: true,
	},
	description: {
		type: String,
		unique: false,
		required: false,
	},
	address: {
		type: String,
		unique: false,
		required: true,
	},
	location: {
		type: String,
		unique: false,
		required: true,
	},
	type: {
		type: String,
		unique: false,
		required: true,
	},
	sensor_id: {
		type: Number,
		unique: false,
		required: true,
	},
	unit: {
		type: String,
		unique: false,
		required: false,
	},
	status: {
		type: Boolean,
		unique: false,
		required: false,
	},
	building: {
		type: String,
		unique: false,
		required: false,
	},
	up_limit: {
		type: Number,
		unique: false,
		required: false,
	},
	down_limit: {
		type: Number,
		unique: false,
		required: false,
	},
	timeout: {
		type: Number,
	},
});

sensorSchema.path("timeout").default(() => Date.now());

export type Sensor = InferSchemaType<typeof sensorSchema>;
export const SensorRepo = model("Sensor", sensorSchema);
