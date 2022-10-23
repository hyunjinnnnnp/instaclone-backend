import * as bcrypt from "bcrypt";
import client from "../../client";
import { Resolvers } from "../../types.js";
import { protectedResolver } from "../users.utils";

const resolveFn = async (
  _,
  { firstName, lastName, username, email, password: newPassword, bio },
  { loggedInUser }
) => {
  let hashedPassword = null;
  if (newPassword) {
    hashedPassword = await bcrypt.hash(newPassword, 10);
  }
  const updatedUser = await client.user.update({
    where: {
      id: loggedInUser.id,
    },
    data: {
      // Prisma Client: data가 undefined일 경우엔 값을 db로 보내지 않는다.
      firstName,
      lastName,
      username,
      email,
      bio,
      ...(hashedPassword && { password: hashedPassword }),
    },
  });
  if (updatedUser.id) {
    return { ok: true };
  } else {
    return { ok: false, error: "Could not update profile." };
  }
};

const resolvers: Resolvers = {
  Mutation: {
    editProfile: protectedResolver(resolveFn),
  },
};

export default resolvers;
