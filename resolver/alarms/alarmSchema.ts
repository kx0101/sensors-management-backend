export const alarmType = `#graphql
	type Query {
        alarms(limit: Int, offset: Int): [Alarm]
		alarm(sensor: SensorInput!): [Alarm]
        getAlarmByAddressAndId(address: String!, sensor: Int!): Alarm
        getAlarmsByAknowledged(aknowledged: Boolean): [Alarm]
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
		createdAt: DateTime
		updatedAt: DateTime
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

	type Subscription {
 		 alarmCreated: Alarm
	}
`;
