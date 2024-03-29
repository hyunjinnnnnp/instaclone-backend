import { gql } from "apollo-server-express";

export default gql`
  type SeeFollowersResult {
    ok: Boolean!
    followers: [User]
    totalPages: Int
    error: String
  }

  type Query {
    seeFollowers(username: String!, page: Int!): SeeFollowersResult!
  }
`;
