import { Resolvers } from "../../types";

const resolvers: Resolvers = {
  Query: {
    seePhoto: async (_, { id }, { client }) => {
      try {
        const photo = await client.photo.findUnique({
          where: { id },
        });
        return { ok: true, photo };
      } catch {
        return { ok: false, error: "Photo not found." };
      }
    },
  },
};

export default resolvers;
