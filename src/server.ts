require("dotenv").config();
// import "dotenv/config";
import { createServer } from "http";
import * as express from "express";
import * as logger from "morgan";
import { ApolloServer } from "apollo-server-express";
import client from "./client";
import { typeDefs, resolvers } from "./schema";
import { getUser } from "./users/users.utils";

const PORT = process.env.PORT;

const apolloServer = new ApolloServer({
  typeDefs,
  resolvers,
  context: async ({ req }) => {
    if (req) {
      return {
        loggedInUser: await getUser(req.headers.token),
        client,
      };
    }
  },
});

const app = express();
app.use(logger("tiny"));
apolloServer.applyMiddleware({ app });
app.use("/static", express.static("uploads"));

const httpServer = createServer(app);
apolloServer.installSubscriptionHandlers(httpServer);

httpServer.listen(PORT, () => {
  console.log(`🌈 Server is running on http://localhost:${PORT}/`);
});
