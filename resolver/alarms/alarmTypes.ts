import { gql } from "apollo-server-express";

export const alarmType = gql`
	type Query {
		alarms: [Alarm]
		alarm(sensor: SensorInput!): [Alarm]
	}

	type Mutation {
		createAlarm(alarmInput: AlarmCreate!): Alarm
		updateAlarm(alarmInput: AlarmUpdate!): Alarm
		deleteAlarms(period: SensorID!): String
	}

	type Alarm {
		_id: ID!
		address: String!
		sensor: Int!
		reason: String
		aknowledged: Boolean
		createdAt: String
		updatedAt: String
	}

	input SensorInput {
		address: String!
		id: Int!
	}

	input AlarmCreate {
		address: String!
		sensor: Int!
		reason: String!
	}

	input AlarmUpdate {
		_id: ID!
		aknowledged: Boolean
	}

	input SensorID {
		sensor: ID!
	}
`;
