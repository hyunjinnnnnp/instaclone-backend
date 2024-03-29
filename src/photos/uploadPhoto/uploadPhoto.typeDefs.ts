import { gql } from "apollo-server-express";

export default gql`
  type uploadPhotoResult {
    ok: Boolean!
    photo: Photo
    error: String
  }

  type Mutation {
    uploadPhoto(file: Upload!, caption: String): uploadPhotoResult!
  }
`;
