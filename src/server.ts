require("dotenv").config();
// import "dotenv/config";
import * as express from "express";
import * as logger from "morgan";
import { ApolloServer } from "apollo-server-express";
import client from "./client";
import { typeDefs, resolvers } from "./schema";
import { getUser } from "./users/users.utils";

const PORT = process.env.PORT;

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: async ({ req }) => {
    return {
      loggedInUser: await getUser(req.headers.token),
      client,
    };
  },
});

const app = express();
app.use(logger("tiny"));
server.applyMiddleware({ app });
// 이제부터 apollo server는 express 위에서 작동한다
app.listen({ port: PORT }, () => {
  console.log(`🌈 Server is running on http://localhost:${PORT}/`);
});
