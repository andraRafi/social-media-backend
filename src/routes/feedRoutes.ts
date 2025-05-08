import express from "express";
import { validate } from "../validation/validation";
import { createFeedSchema } from "../validation/feedValidation";
import { createFeed, deleteFeed, myfeeds } from "../controller/feedController";
import { upload } from "../middleware/uploadHandler";
import { validateToken } from "../middleware/jwtHandler";
const router = express.Router();

router.post(
  "/",
  validateToken,
  upload.single("media"),

  createFeed
);

router.get("/", validateToken, myfeeds);
router.delete("/:feedId", validateToken, deleteFeed);

export default router;
