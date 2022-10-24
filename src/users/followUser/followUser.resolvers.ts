import client from "../../client";
import { Resolvers } from "../../types";
import { protectedResolver } from "../users.utils";

const resolveFn = async (_, { username }, { loggedInUser }) => {
  try {
    await client.user.update({
      where: {
        id: loggedInUser.id,
      },
      data: {
        following: {
          connect: {
            username,
            // unique field only
          },
        },
      },
    });
    return { ok: true };
  } catch {
    return { ok: false, error: `${username} does not exist.` };
  }
};

const resolvers: Resolvers = {
  Mutation: {
    followUser: protectedResolver(resolveFn),
  },
};

export default resolvers;
