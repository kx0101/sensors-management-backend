export const sensorType = `#graphql
	type Query {
		sensors: [Sensor]
		sensor(location: String!): Sensor
        getSensorByAddressAndId(address: String!, sensor_id: Int!): Sensor
	}

	type Mutation {
		createSensor(sensorInput: SensorCreate!): Sensor
		updateSensor(sensorInput: SensorUpdate!): Sensor
		deleteSensor(_id: ID!): Sensor
        updateStatusSensor(_id: ID!, status: Boolean!): Sensor
	}

	type Sensor {
		_id: ID!
		name: String!
		description: String
		address: String!
		location: String!
		type: String!
		sensor_id: Int!
		unit: String
		status: Boolean
		building: String
		up_limit: Float
		down_limit: Float
	}

	input SensorCreate {
		name: String!
		description: String
		address: String!
		location: String!
		type: String!
		sensor_id: Int!
		unit: String
		status: Boolean
		building: String
		up_limit: Float
		down_limit: Float
	}

	input SensorUpdate {
		_id: ID!
		name: String
		description: String
		address: String
		location: String
		type: String
		sensor_id: Int
		unit: String
		status: Boolean
		building: String
		up_limit: Float
		down_limit: Float
	}
`;
