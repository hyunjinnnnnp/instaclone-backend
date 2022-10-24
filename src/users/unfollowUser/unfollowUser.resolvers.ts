import { protectedResolver } from "./../users.utils";
import { Context, Resolvers } from "../../types";

const resolveFn = async (
  _,
  { username },
  { loggedInUser, client }: Context
) => {
  try {
    const followee = await client.user.findUnique({
      where: { username },
    });
    if (!followee) {
      return { ok: false, error: `${username} does not exist.` };
    }
    await client.user.update({
      where: { id: loggedInUser.id },
      data: {
        following: {
          disconnect: {
            username,
          },
        },
      },
    });
    return { ok: true };
  } catch {
    return { ok: false, error: `Can't unfollow ${username}` };
  }
};

const resolvers: Resolvers = {
  Mutation: {
    unfollowUser: protectedResolver(resolveFn),
  },
};

export default resolvers;
