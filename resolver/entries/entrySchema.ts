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
		expireAt: String
		createdAt: Float
		updatedAt: Float
	}
	input EntryID {
		address: String!
		sensor: Int!
		period: Int!
	}
	input EntryCreate {
		address: String!
		sensor: Int!
		value: Int!
	}

	type Subscription {
 		 entryCreated: Entry
	}
`;
