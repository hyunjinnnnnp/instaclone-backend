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
    isMe: ({ id }, _, { loggedInUser }) => {
      return id === loggedInUser?.id;
    },
    isFollowing: async ({ id }, _, { loggedInUser, client }) => {
      if (!loggedInUser) {
        return false;
      }
      const exists = await client.user.count({
        where: {
          id: loggedInUser.id,
          following: {
            some: { id },
          },
        },
      });
      return Boolean(exists);
    },
    photos: ({ id }, _, { client }) => {
      return client.user
        .findUnique({
          where: {
            id,
          },
        })
        .photos();
    },
  },
};

export default resolvers;
