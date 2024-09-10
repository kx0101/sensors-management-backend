import { User } from '../models/users'

export const usertypeDefs = `#graphql
    {
        type Query {
            users: [User]
            user(user:UserInput!): User
        },

        input UserInput{
            id: String!
        }
    }
`;

export const userResolvers = {
    Query: {
      users: async () => {
        return await User.find();
      },

      user: async ( id: string ) => {
        return await User.findById(id);
    },

  }
};