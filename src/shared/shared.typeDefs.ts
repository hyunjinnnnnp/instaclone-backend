import { gql } from "apollo-server-express";

export default gql`
  interface MutationResponse {
    ok: Boolean!
    error: String
  }
`;
