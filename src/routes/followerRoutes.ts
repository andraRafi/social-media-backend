import express from "express";

import { validateToken } from "../middleware/jwtHandler";
import {
  followUser,
  showFollowers,
  showFollowing,
  unfollowUser,
} from "../controller/followController";

const router = express.Router();

router.post("/follow/:userId", validateToken, followUser);
router.get("/followers/:userId", validateToken, showFollowers);
router.get("/following/:userId", validateToken, showFollowing);
router.post("/unfollow/:userId", validateToken, unfollowUser);

export default router;
