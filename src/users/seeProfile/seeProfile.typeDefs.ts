import { gql } from "apollo-server";

export default gql`
  type SeeProfileResult {
    ok: Boolean!
    user: User
    error: String
  }

  type Query {
    seeProfile(username: String!): SeeProfileResult!
  }
`;
