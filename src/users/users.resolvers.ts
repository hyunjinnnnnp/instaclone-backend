import { Resolvers } from "../types";

const resolvers: Resolvers = {
  User: {
    totalFollowing: ({ id }, _, { client }) => {
      return client.user.count({
        where: {
          followers: {
            some: { id },
          },
        },
      });
    },
    totalFollowers: ({ id }, _, { client }) => {
      return client.user.count({
        where: {
          following: {
            some: { id },
          },
        },
      });
    },
  },
};

export default resolvers;
