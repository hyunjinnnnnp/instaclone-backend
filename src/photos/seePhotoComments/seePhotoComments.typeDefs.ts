import { gql } from "apollo-server-express";

export default gql`
  type Result {
    comments: [Comment]
  }
  type SeePhotoCommentsResult {
    ok: Boolean!
    result: Result
    error: String
  }
  type Query {
    seePhotoComments(photoId: Int!, lastId: Int): SeePhotoCommentsResult!
  }
`;
