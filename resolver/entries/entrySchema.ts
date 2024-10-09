export const entryType = `#graphql
	type Query {
		entries(sensor: EntryID!): [Entry]
        entry(sensorAddress: String!, sensorId: Int!): Entry
	}
	type Mutation {
		createEntry(entryInput: EntryCreate!): Entry
		deleteEntries(entryInput: EntryID!): String
	}
	type Entry {
		_id: ID!
		address: String!
		sensor: Int!
		value: Float!
		expireAt: DateTime
		createdAt: DateTime
		updatedAt: DateTime
	}
	input EntryID {
		address: String!
		sensor: Int!
		period: Int!
	}
	input EntryCreate {
		address: String!
		sensor: Int!
		value: Float!
	}

	type Subscription {
 		 entryCreated: Entry
         timeoutCreated: timeoutData
	}

    type timeoutData {
        sensor_id: String!
        timeout: DateTime
    }
`;
