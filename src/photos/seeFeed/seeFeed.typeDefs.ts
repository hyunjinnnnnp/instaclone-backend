import { gql } from "apollo-server-express";

export default gql`
  type SeeFeedResult {
    ok: Boolean!
    photos: [Photo]
    error: String
  }
  type Query {
    seeFeed(lastId: Int): SeeFeedResult!
  }
`;
