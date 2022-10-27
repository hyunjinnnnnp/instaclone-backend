import { Context, Resolvers } from "../../types";
import { protectedResolver } from "../../users/users.utils";

const resolveFn = async (_, { photoId }, { client, loggedInUser }: Context) => {
  try {
    const photo = await client.photo.findUnique({
      where: { id: photoId },
    });
    if (!photo) {
      return { ok: false, error: "Photo not found." };
    }
    const like = await client.like.findUnique({
      where: {
        userId_photoId: {
          userId: loggedInUser.id,
          photoId,
        },
      },
    });
    if (like) {
      await client.like.delete({
        where: {
          id: like.id,
        },
      });
    } else {
      await client.like.create({
        data: {
          user: {
            connect: {
              id: loggedInUser.id,
            },
          },
          photo: {
            connect: {
              id: photoId,
            },
          },
        },
      });
    }
    return { ok: true };
  } catch {
    return { ok: false, error: "Could not complete the action." };
  }
};

const resolvers: Resolvers = {
  Mutation: {
    toggleLike: protectedResolver(resolveFn),
  },
};

export default resolvers;
