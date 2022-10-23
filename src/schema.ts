import { loadFilesSync } from "@graphql-tools/load-files";
import { mergeResolvers, mergeTypeDefs } from "@graphql-tools/merge";

const loadedTypes = loadFilesSync(`${__dirname}/**/*.typeDefs.ts`);
const loadedResolvers = loadFilesSync(`${__dirname}/**/*.resolvers.ts`);

export const typeDefs = mergeTypeDefs(loadedTypes);
export const resolvers: any = mergeResolvers(loadedResolvers);

//const schema = makeExecutableSchema({ typeDefs, resolvers });
// typeDefs, resolvers를 직접 Apollo Server로 보낸다.
// 이제부터 graphql-tool 대신 아폴로 서버를 이용해서 schema를 생성할 것임.
