import { Resolvers } from "../../types";

const resolvers: Resolvers = {
  Query: {
    seePhotoComments: async (_, { photoId, lastId }, { client }) => {
      try {
        const photo = await client.photo.findUnique({
          where: { id: photoId },
          select: { id: true },
        });
        if (!photo) {
          return { ok: false, error: "Photo not found." };
        }
        const comments = await client.comment.findMany({
          where: {
            photoId,
          },
          take: 5,
          skip: lastId ? 1 : 0,
          ...(lastId && { cursor: { id: lastId } }),
          orderBy: { createdAt: "desc" },
        });
        const commentsNumber = await client.comment.count({
          where: {
            photoId,
          },
        });
        return {
          ok: true,
          result: { comments, totalPages: Math.ceil(commentsNumber / 5) },
        };
      } catch {
        return { ok: false, error: "Could not load comments." };
      }
    },
  },
};

export default resolvers;
