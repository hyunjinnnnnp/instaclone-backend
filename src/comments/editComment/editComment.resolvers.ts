import { Resolver, Resolvers } from "../../types";
import { protectedResolver } from "../../users/users.utils";

const resolveFn: Resolver = async (
  _,
  { commentId, payload },
  { client, loggedInUser }
) => {
  try {
    const comment = await client.comment.findUnique({
      where: { id: commentId },
      select: { userId: true },
    });
    if (!comment) {
      return { ok: false, error: "Comment not found." };
    }
    if (comment.userId !== loggedInUser.id) {
      return { ok: false, error: "Not authorized." };
    }
    await client.comment.update({
      where: { id: commentId },
      data: {
        payload,
      },
    });
    return { ok: true };
  } catch {
    return { ok: false, error: "Could not edit." };
  }
};

const resolvers: Resolvers = {
  Mutation: {
    editComment: protectedResolver(resolveFn),
  },
};

export default resolvers;
