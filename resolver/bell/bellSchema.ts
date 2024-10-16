export const bellType = `#graphql
	type Query {
		bell: Bell
	}

	type Mutation {
		updateBell(bellInput: BellUpdate!): Bell
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
