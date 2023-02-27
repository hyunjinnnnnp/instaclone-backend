import * as bcrypt from "bcrypt";
import client from "../../client";
import { Resolver, Resolvers } from "../../types.js";
import { protectedResolver } from "../users.utils";
import { uploadToS3 } from "../../shared/shared.utils";

const resolveFn: Resolver = async (
  _,
  { firstName, lastName, username, email, password: newPassword, bio, avatar },
  { loggedInUser }
) => {
  let hashedPassword = null;
  let avatarUrl = null;

  if (newPassword) {
    hashedPassword = await bcrypt.hash(newPassword, 10);
  }
  if (avatar) {
    avatarUrl = await uploadToS3(avatar, loggedInUser.id, "avatars");
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
      ...(avatarUrl && { avatar: avatarUrl }),
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
