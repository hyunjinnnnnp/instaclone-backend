import { gql } from "apollo-server-express";

export default gql`
  type seePhotoResult {
    ok: Boolean!
    photo: Photo
    error: String
  }
  type Query {
    seePhoto(id: Int!): seePhotoResult
  }
`;
