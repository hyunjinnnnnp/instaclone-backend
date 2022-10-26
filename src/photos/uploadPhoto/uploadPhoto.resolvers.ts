import { Context, Resolvers } from "../../types";
import { protectedResolver } from "../../users/users.utils";

const resolveFn = async (
  _,
  { file, caption },
  { client, loggedInUser }: Context
) => {
  try {
    let hashtagObjs = [];
    if (caption) {
      const hashtags = caption.match(/#[\w]+/g);
      hashtagObjs = hashtags.map((hashtag) => ({
        where: { hashtag },
        create: { hashtag },
      }));
    }
    const photo = await client.photo.create({
      data: {
        user: {
          connect: {
            id: loggedInUser.id,
          },
        },
        file,
        caption,
        ...(hashtagObjs.length > 0 && {
          hashtags: {
            connectOrCreate: hashtagObjs,
          },
        }),
      },
    });
    return { ok: true, photo };
  } catch {
    return { ok: false, error: "Could not upload." };
  }
};

const resolvers: Resolvers = {
  Mutation: {
    uploadPhoto: protectedResolver(resolveFn),
  },
};

export default resolvers;
