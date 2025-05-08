import express from "express";
import { validateToken } from "../middleware/jwtHandler";
import {
  addComment,
  deleteComment,
  editComment,
  showComment,
} from "../controller/commentController";
import { validate } from "../validation/validation";
import { CommentSchema } from "../validation/commentValidation";

const router = express.Router();

router.post("/:feedId", validateToken, validate(CommentSchema), addComment);
router.get("/:feedId", validateToken, showComment);
router.delete("/:commentId", validateToken, deleteComment);
router.put("/:commentId", validateToken, editComment);

export default router;
