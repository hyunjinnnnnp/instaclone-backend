import { processHashtags } from "./../photos.utils";
import { Resolvers } from "../../types";

const resolvers: Resolvers = {
  Mutation: {
    editPhoto: async (_, { id, caption }, { loggedInUser, client }) => {
      try {
        const photo = await client.photo.findFirst({
          where: {
            id,
            userId: loggedInUser.id,
          },
          include: {
            hashtags: {
              select: {
                hashtag: true,
              },
            },
          },
        });
        // if(photo.userId !== loggedInUser.id){
        //     return {ok: false, error: "You can only edit own"}
        // }

        // ----> where: { id, userId: loggedInUser.id }

        if (!photo) {
          return { ok: false, error: "Photo not found." };
        }
        const updatedPhoto = await client.photo.update({
          where: { id },
          data: {
            caption,
            hashtags: {
              disconnect: photo.hashtags,
              connectOrCreate: processHashtags(caption),
            },
          },
        });
        return { ok: true, photo: updatedPhoto };
      } catch {
        return { ok: false, error: "Could not edit." };
      }
    },
  },
};

export default resolvers;
