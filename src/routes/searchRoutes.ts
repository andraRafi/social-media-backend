import express from "express";
import { searchUser } from "../controller/searchController";

const router = express.Router();
router.get("/search", searchUser);

export default router;
