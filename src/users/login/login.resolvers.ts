import * as bcrypt from "bcrypt";
import * as jwt from "jsonwebtoken";
import client from "../../client";
import { Resolvers } from "../../types.js";

const resolvers: Resolvers = {
  Mutation: {
    login: async (_, { username, password }) => {
      const user = await client.user.findFirst({ where: { username } });
      if (!user) {
        return { ok: false, error: "User not found." };
      }
      const passwordCorrect = await bcrypt.compare(password, user.password);
      if (!passwordCorrect) {
        return { ok: false, error: "Incorrect password." };
      }
      const token = await jwt.sign({ id: user.id }, process.env.SECRET_KEY!);
      return { ok: true, token };
    },
  },
};

export default resolvers;
