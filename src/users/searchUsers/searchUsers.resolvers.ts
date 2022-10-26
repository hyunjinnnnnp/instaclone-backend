import { Resolvers } from "../../types";

const resolvers: Resolvers = {
  Query: {
    searchUsers: async (_, { keyword, lastId }, { client }) => {
      try {
        if (keyword.length < 3) {
          return {
            ok: false,
            error: "Keyword has to be longer than 3 letters.",
          };
        }
        const users = await client.user.findMany({
          where: {
            username: {
              startsWith: keyword,
              mode: "insensitive", // doesn't care LOWER/UPPER CASE
            },
          },
          take: 5,
          skip: lastId ? 1 : 0,
          ...(lastId && { cursor: { id: lastId } }),
        });
        return { ok: true, users };
      } catch {
        return { ok: false, error: "Could not load." };
      }
    },
  },
};

export default resolvers;
