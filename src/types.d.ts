import { PrismaClient } from "@prisma/client";
import { User } from "@prisma/client";

type Context = {
  loggedInUser: User;
  client: PrismaClient;
};
type Info = {
  [key: string]: {
    [key: string]: string;
  };
};

export type Resolver = (
  root: any,
  args: any,
  context: Context,
  info: Info
) => any;

export type Resolvers = {
  [key: string]: {
    [key: string]: Resolver;
  };
};
