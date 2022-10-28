import { gql } from "apollo-server-express";

export default gql`
  type CreateCommentReesult {
    ok: Boolean!
    result: Comment
    error: String
  }
  type Mutation {
    createComment(photoId: Int!, payload: String!): CreateCommentReesult!
  }
`;
