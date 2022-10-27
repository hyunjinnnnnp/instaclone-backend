import { gql } from "apollo-server-express";

export default gql`
  type SeePhotoLikesResult {
    ok: Boolean!
    result: [User]
    error: String
  }

  type Query {
    seePhotoLikes(photoId: Int!): SeePhotoLikesResult!
  }
`;
