import { uploadToS3 } from "../../shared/shared.utils";
import { Resolver, Resolvers } from "../../types";
import { protectedResolver } from "../../users/users.utils";
import { processHashtags } from "../photos.utils";

const resolveFn: Resolver = async (
  _,
  { file, caption },
  { client, loggedInUser }
) => {
  try {
    let hashtagObjs = [];
    if (caption) {
      hashtagObjs = processHashtags(caption);
    }
    const fileUrl = await uploadToS3(file, loggedInUser.id, "uploads");
    const photo = await client.photo.create({
      data: {
        user: {
          connect: {
            id: loggedInUser.id,
          },
        },
        file: fileUrl,
        caption,
        ...(hashtagObjs.length > 0 && {
          hashtags: {
            connectOrCreate: hashtagObjs,
          },
        }),
      },
    });
    if (!photo) {
      return { ok: false, error: "Could not upload." };
    }
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
