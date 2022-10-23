import { createWriteStream } from "fs";
import * as bcrypt from "bcrypt";
import client from "../../client";
import { Resolvers } from "../../types.js";
import { protectedResolver } from "../users.utils";

const resolveFn = async (
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
    const { filename, createReadStream } = await avatar;
    const newFilename = `${loggedInUser.id}-${Date.now()}-${filename}`;
    const readStream = createReadStream();
    const writeStream = createWriteStream(
      process.cwd() + "/uploads/" + newFilename
    );
    // process.cwd: Current Working Directory
    readStream.pipe(writeStream);
    // readStream과 writeStream을 pipe(연결)시켜준다.
    avatarUrl = `http://localhost:4000/static/${newFilename}`;
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
