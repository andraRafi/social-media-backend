import express from "express";
import http from "http";
import { Server } from "socket.io";
import cookieParser from "cookie-parser";
import cors from "cors";
import "dotenv/config";
import { errorHandler } from "./middleware/errorHandler";
import authRouter from "./routes/authRoutes";
import feedRouter from "./routes/feedRoutes";
import commentRouter from "./routes/commentRoutes";
import userRouter from "./routes/userRoutes";
import followerRouter from "./routes/followerRoutes";
import searchRouter from "./routes/searchRoutes";
import { connectDb } from "./config/db";
import { socketHandler } from "./socket/socket";
connectDb();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRouter);
app.use("/api/feeds", feedRouter);
app.use("/api/feeds/comment", commentRouter);
app.use("/api/my", userRouter);
app.use("/api/connection", followerRouter);
app.use("/api/users", searchRouter);

app.use(errorHandler);

socketHandler(io);

server.listen(port, () => {
  console.log(`server is running on port ${port}`);
});
