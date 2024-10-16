export const userType = `#graphql
	type User {
		id: String
		username: String
		role: String
	}

	type Query {
		users: [User]
		user(user: UserInput!): User
		userByUsername(username: String!): User
	}

	input UserInput {
		id: String!
	}
`;
