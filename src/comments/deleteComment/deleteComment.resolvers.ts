import { Resolver, Resolvers } from "../../types";
import { protectedResolver } from "../../users/users.utils";

const resolveFn: Resolver = async (
  _,
  { commentId },
  { client, loggedInUser }
) => {
  try {
    const comment = await client.comment.findUnique({
      where: {
        id: commentId,
      },
      select: {
        userId: true,
      },
    });
    if (!comment) {
      return { ok: false, error: "Comment not found." };
    }
    if (loggedInUser.id !== comment.userId) {
      return {
        ok: false,
        error: "Could not delete if it's not the your comment.",
      };
    }
    await client.comment.delete({
      where: {
        id: commentId,
      },
    });
    return { ok: true };
  } catch {
    return { ok: false, error: "Could not delete." };
  }
};

const resolvers: Resolvers = {
  Mutation: {
    deleteComment: protectedResolver(resolveFn),
  },
};

export default resolvers;
