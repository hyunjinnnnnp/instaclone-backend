import bcrypt from "bcrypt";
import client from "../../client";

export default {
  Mutation: {
    editProfile: async (
      _,
      { firstName, lastName, username, email, password: newPassword },
      { loggedInUser, protectResolver }
    ) => {
      protectResolver(loggedInUser);
      // 여기저기서 import 하지않기 위해 context에 protectResolver를 전달해서 사용한다
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
    },
  },
};
