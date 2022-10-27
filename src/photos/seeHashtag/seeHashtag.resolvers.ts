import { Resolvers } from "../../types";

const resolvers: Resolvers = {
  Query: {
    seeHashtag: async (_, { hashtag: str }, { client }) => {
      try {
        const hashtag = await client.hashtag.findUnique({
          where: { hashtag: str },
        });
        if (!hashtag) {
          return { ok: false, error: `${str} does not exist.` };
        }
        return { ok: true, hashtag };
      } catch {
        return { ok: false, error: "Could not load." };
      }
    },
  },
};

export default resolvers;
