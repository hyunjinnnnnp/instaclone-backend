import { Resolvers } from "../../types";

const resolvers: Resolvers = {
  Query: {
    seeFollowing: async (_, { username, lastId }, { client }) => {
      try {
        const user = await client.user.findUnique({
          where: { username },
          select: { id: true },
        });
        if (!user) {
          return { ok: false, error: "User not found." };
        }
        const following = await client.user
          .findUnique({ where: { username } })
          .following({
            take: 5,
            skip: lastId ? 1 : 0,
            ...(lastId && { cursor: { id: lastId } }),
          });
        // cursor: DB에게 마지막 결과를 알려주는 역할
        return {
          ok: true,
          following,
        };
      } catch {
        return { ok: false, error: "Could not load Following." };
      }
    },
  },
};
export default resolvers;
