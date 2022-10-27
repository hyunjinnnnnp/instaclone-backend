import { gql } from "apollo-server-express";

export default gql`
  type seeHashtagResult {
    ok: Boolean!
    hashtag: Hashtag
    error: String
  }

  type Query {
    seeHashtag(hashtag: String!): seeHashtagResult!
  }
`;
