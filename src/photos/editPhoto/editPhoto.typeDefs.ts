import { gql } from "apollo-server-express";

export default gql`
  type EditPhotoResult {
    ok: Boolean!
    photo: Photo
    error: String
  }
  type Mutation {
    editPhoto(id: Int!, caption: String!): EditPhotoResult!
  }
`;
