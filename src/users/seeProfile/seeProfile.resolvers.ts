import { Resolvers } from "../../types";

const resolvers: Resolvers = {
  Query: {
    seeProfile: async (_, { username }, { client }) => {
      try {
        await client.user.findUnique({
          where: {
            username,
          },
          // 모든 Relation에 관한 데이터를 한꺼번에 보여주겠다
          include: {
            following: true,
            followers: true,
          },
        });
      } catch {}
    },
  },
};

export default resolvers;
