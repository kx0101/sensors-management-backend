import { mergeTypeDefs, mergeResolvers } from '@graphql-tools/merge';
import { loadFilesSync } from '@graphql-tools/load-files';
import path from 'path';

const typeDefsArray = loadFilesSync(path.join(__dirname, '../resolver/**/*.graphql'), {
    recursive: true,
    extensions: ['graphql']
});

const resolversArray = loadFilesSync(path.join(__dirname, '../resolver/**/*.ts'), {
    recursive: true,
    extensions: ['graphql']
});

const typeDefs = mergeTypeDefs(typeDefsArray);
const resolvers = mergeResolvers(resolversArray);

export { typeDefs, resolvers };
