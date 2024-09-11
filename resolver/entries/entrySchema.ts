import { gql } from "apollo-server-express";

export const entryType = gql`
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
`;
