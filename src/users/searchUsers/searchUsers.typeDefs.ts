import { gql } from "apollo-server-express";

export default gql`
  type SearchUsersResults {
    ok: Boolean!
    users: [User]
    error: String
  }
  type Query {
    searchUsers(keyword: String!, lastId: Int): SearchUsersResults!
  }
`;
