import { Context, Resolvers } from "../../types";
import { protectedResolver } from "../../users/users.utils";

const resolveFn = async (_, { lastId }, { client, loggedInUser }: Context) => {
  try {
    const photos = await client.photo.findMany({
      where: {
        OR: [
          {
            user: {
              followers: {
                some: {
                  id: loggedInUser.id,
                },
              },
            },
          },
          {
            userId: loggedInUser.id,
          },
        ],
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 5,
      skip: lastId ? 1 : 0,
      ...(lastId && { cursor: { id: lastId } }),
    });
    if (!photos) {
      return { ok: false, error: "Photo not found." };
    }
    return { ok: true, photos };
  } catch {
    return { ok: false, error: "Could not load." };
  }
};

const resolvers: Resolvers = {
  Query: {
    seeFeed: protectedResolver(resolveFn),
  },
};

export default resolvers;
