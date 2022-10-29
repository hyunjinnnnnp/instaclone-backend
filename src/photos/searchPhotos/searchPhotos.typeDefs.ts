import { gql } from "apollo-server-express";

export default gql`
  type searchPhotosResult {
    ok: Boolean!
    photos: [Photo]
    totalPhotos: Int
    error: String
  }

  type Query {
    searchPhotos(keyword: String!, lastId: Int): searchPhotosResult!
  }
`;
