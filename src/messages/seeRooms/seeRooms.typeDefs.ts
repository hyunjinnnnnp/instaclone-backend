import { gql } from "apollo-server-express";
export default gql`
  type seeRoomsResult {
    ok: Boolean!
    rooms: [Room]
    error: String
  }
  type Query {
    seeRooms: seeRoomsResult!
  }
`;
