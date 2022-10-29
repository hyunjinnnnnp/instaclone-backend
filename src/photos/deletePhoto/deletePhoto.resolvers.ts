import { Resolver, Resolvers } from "../../types";
import { protectedResolver } from "../../users/users.utils";

const resolveFn: Resolver = async (
  _,
  { photoId },
  { client, loggedInUser }
) => {
  try {
    const photo = await client.photo.findUnique({
      where: { id: photoId },
      select: {
        userId: true,
        hashtags: {
          select: { id: true },
        },
      },
    });
    if (!photo) {
      return { ok: false, error: "Photo not found." };
    }
    if (loggedInUser.id !== photo.userId) {
      return { ok: false, error: "Not authorized." };
    }
    const hashIds = photo.hashtags?.map((hash) => ({ id: hash.id }));

    if (photo.hashtags) {
      // disconnect Hashtags
      await client.photo.update({
        where: { id: photoId },
        data: { hashtags: { disconnect: photo.hashtags } },
      });
    }
    // delete photo
    const ok = await client.photo.delete({
      where: { id: photoId },
    });

    let hashtagWithoutPhotos: { id: number }[];
    if (ok) {
      hashtagWithoutPhotos = hashIds?.filter(async (id) => {
        const hash = await client.hashtag.findFirst({
          where: id,
          select: {
            photos: {
              select: { id: true },
            },
          },
        });
        return hash.photos.length === 0;
      });
    }
    if (ok && hashtagWithoutPhotos) {
      await client.hashtag.deleteMany({
        where: { OR: hashtagWithoutPhotos },
      });
    }

    return { ok: true };
  } catch {
    return { ok: false, error: "Could not delete." };
  }
};

const resolvers: Resolvers = {
  Mutation: {
    deletePhoto: protectedResolver(resolveFn),
  },
};

export default resolvers;
