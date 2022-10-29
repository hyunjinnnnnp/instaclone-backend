import { Resolver, Resolvers } from "../../types";
import { protectedResolver } from "../../users/users.utils";

const resolveFn: Resolver = async (
  _,
  { photoId, payload },
  { client, loggedInUser }
) => {
  try {
    const photo = await client.photo.findUnique({
      where: {
        id: photoId,
      },
      select: {
        // only for checking
        id: true,
      },
    });
    if (!photo) {
      return { ok: false, error: "Photo not found." };
    }
    await client.comment.create({
      data: {
        photo: {
          connect: {
            id: photoId,
          },
        },
        user: {
          connect: {
            id: loggedInUser.id,
          },
        },
        payload,
      },
    });
    return { ok: true };
  } catch {
    return { ok: false, error: "Could not complete." };
  }
};

const resolvers: Resolvers = {
  Mutation: {
    createComment: protectedResolver(resolveFn),
  },
};

export default resolvers;
