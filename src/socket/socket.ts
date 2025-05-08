import { Server, Socket } from "socket.io";
import jwt from "jsonwebtoken";
import { DefaultEventsMap } from "socket.io";

const onlineUsers = new Map<string, string>();

export const socketHandler = (
  io: Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>
) => {
  io.on("connection", (socket: Socket) => {
    console.log("new client connected", socket.id);

    socket.on("auth", (token: string) => {
      try {
        const decoded = jwt.verify(
          token,
          process.env.JWT_SECRET || "default_secret"
        ) as { _id: string };
        onlineUsers.set(decoded._id, socket.id);
        console.log("✅ Authenticated:", decoded._id);
        socket.emit("auth_success", { message: "authenticated" });
      } catch (error) {
        console.log("❌ Auth failed");
        socket.emit("auth_error", { message: "invalid token" });
        socket.disconnect();
      }
    });

    socket.on("send_dm", ({ toUserId, message }) => {
      const toSocketId = onlineUsers.get(toUserId);
      if (toSocketId) {
        io.to(toSocketId).emit("receive_dm", message);
      }
    });
  });
};
