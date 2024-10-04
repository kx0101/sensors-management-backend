export const sensorType = `#graphql
	type Query {
		sensors: [Sensor]
		sensor(location: String!): Sensor
        getSensorByAddressAndId(address: String!, sensor_id: Int!): Sensor
        getSensorsByBuilding(building: String!): [Sensor]
        getSensorUniqueBuildings: [String]
        getSensorsByBatch(inputs: [SensorBatchInput!]!): [Sensor!]!
        getSensorEntriesLast24Hours(sensors: [SensorBatchInput!]!): [AverageEntry]
	}

	type Mutation {
		createSensor(sensorInput: SensorCreate!): Sensor
		updateSensor(sensorInput: SensorUpdate!): Sensor
		deleteSensor(_id: ID!): Sensor
        updateStatusSensor(_id: ID!, status: Boolean!): Sensor
	}

    type AverageEntry {
        sensorId: Int!
        averages: [Float!]!
        address: String!
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

    input SensorBatchInput {
        address: String!
        sensor_id: Int!
    }
`;
