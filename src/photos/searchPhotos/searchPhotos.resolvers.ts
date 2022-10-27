import { Resolvers } from "../../types";

const resolvers: Resolvers = {
  Query: {
    searchPhotos: async (_, { keyword, lastId }, { client }) => {
      try {
        const photos = await client.photo.findMany({
          where: {
            caption: {
              startsWith: keyword,
            },
          },
          take: 5,
          skip: lastId ? 1 : 0,
          ...(lastId && { cursor: { id: lastId } }),
        });
        const totalPhotos = await client.photo.count({
          where: {
            caption: {
              startsWith: keyword,
            },
          },
        });
        if (!photos) {
          return { ok: false, error: `Could not search with ${keyword}` };
        }
        return { ok: true, photos, totalPhotos };
      } catch {
        return { ok: false, error: "Could not load." };
      }
    },
  },
};

export default resolvers;
