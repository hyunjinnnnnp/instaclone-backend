import { Resolvers } from "../types";

const resolvers: Resolvers = {
  Photo: {
    user: ({ userId }, _, { client }) => {
      return client.user.findUnique({ where: { id: userId } });
    },
    hashtags: ({ id }, _, { client }) => {
      return client.hashtag.findMany({
        where: {
          photos: {
            some: {
              id,
            },
          },
        },
      });
    },
    likesNumber: ({ id: photoId }, _, { client }) => {
      return client.like.count({
        where: {
          photoId,
        },
      });
    },
    commentsNumber: ({ id: photoId }, _, { client }) => {
      return client.comment.count({
        where: {
          photoId,
        },
      });
    },
    isMine: () => {},
  },
  Hashtag: {
    photos: ({ id }, { lastId }, { client }) => {
      return client.hashtag
        .findUnique({
          where: {
            id,
          },
        })
        .photos({
          take: 5,
          skip: lastId ? 1 : 0,
          ...(lastId && { cursor: { id: lastId } }),
        });
    },
    totalPhotos: ({ id }, _, { client }) => {
      return client.photo.count({
        where: {
          hashtags: {
            some: { id },
          },
        },
      });
    },
  },
};

export default resolvers;
