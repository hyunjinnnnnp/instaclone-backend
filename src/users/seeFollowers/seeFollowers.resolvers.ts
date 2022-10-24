import { Resolvers } from "../../types";

const resolvers: Resolvers = {
  Query: {
    seeFollowers: async (_, { username, page }, { client }) => {
      try {
        const user = await client.user.findUnique({
          where: { username },
          select: { id: true },
          // id를 제외한 데이터는 가져오지 않겠다.
        });
        if (!user) {
          return { ok: false, error: "User not found." };
        }
        const followers = await client.user
          .findUnique({
            where: { username },
          })
          .followers({
            take: 5,
            skip: (page - 1) * 5,
          });
        const totalFollowers = await client.user.count({
          where: {
            following: {
              some: { username },
            },
          },
        });
        return {
          ok: true,
          followers,
          totalPages: Math.ceil(totalFollowers / 5),
        };
      } catch {
        return { ok: false, error: "Can't load followers." };
      }
    },
  },
};

export default resolvers;
