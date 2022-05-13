import * as bcrypt from "bcrypt";
import client from "../../client";
import { protectedResolver } from "../users.utils";

const resolveFn = async (
  _,
  { firstName, lastName, username, email, password: newPassword },
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
      firstName,
      lastName,
      username,
      email,
      ...(hashedPassword && { password: hashedPassword }),
    },
  });
  if (updatedUser.id) {
    return { ok: true };
  } else {
    return { ok: false, error: "Could not update profile." };
  }
};

export default {
  Mutation: {
    editProfile: protectedResolver(resolveFn),
  },
};
