export const entryType = `#graphql
	type Query {
		entries(sensor: EntryID!): [Entry]
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
	}
`;
