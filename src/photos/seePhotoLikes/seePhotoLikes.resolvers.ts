import { Resolvers } from "../../types";

const resolvers: Resolvers = {
  Query: {
    seePhotoLikes: async (_, { photoId }, { client }) => {
      try {
        const likedUser = await client.like.findMany({
          where: {
            photoId,
          },
          select: {
            user: true,
          },
        });
        return { ok: true, result: likedUser.map((like) => like.user) };
      } catch {
        return { ok: false, error: "Could not load." };
      }
    },
  },
};

export default resolvers;
