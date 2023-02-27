import client from "../../client";
import { protectedResolver } from "./../../users/users.utils";
export default {
  Query: {
    seeRooms: protectedResolver(async (_, __, { loggedInUser }) => {
      try {
        const rooms = await client.room.findMany({
          where: {
            users: {
              some: {
                id: loggedInUser.id,
              },
            },
          },
        });
        return { ok: true, rooms };
      } catch {
        return { ok: false, error: "Room not found" };
      }
    }),
  },
};
