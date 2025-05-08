import express from "express";

const router = express.Router();
import { validateToken } from "../middleware/jwtHandler";
import { curentAccount, setBio } from "../controller/userController";
router.post("/bio", validateToken, setBio);
router.get("/info", validateToken, curentAccount);

export default router;
