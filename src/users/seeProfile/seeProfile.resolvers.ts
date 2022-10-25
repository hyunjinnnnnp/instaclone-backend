import { Resolvers } from "../../types";

const resolvers: Resolvers = {
  Query: {
    seeProfile: async (_, { username }, { client }) => {
      try {
        const isExisting = await client.user.findUnique({
          where: {
            username,
          },
        });
        if (!isExisting) {
          return { ok: false, error: `${username} does not exist.` };
        }
        const user = await client.user.findUnique({
          where: {
            username,
          },
          // 모든 Relation에 관한 데이터를 한꺼번에 보여주겠다
          include: {
            following: true,
            followers: true,
          },
        });
        return { ok: true, user };
      } catch {
        return { ok: false, error: "Can't load profile." };
      }
    },
  },
};

export default resolvers;
