import { gql } from "apollo-server-express";

export const bellType = gql`
	type Query {
		bell: Bell
	}

	type Mutation {
		bellUpdate(bellInput: BellUpdate!): Bell
	}

	type Bell {
		_id: ID!
		status: Boolean!
	}

	input BellUpdate {
		_id: ID!
		status: Boolean
	}
`;
