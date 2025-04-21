import express from "express";
import { createPost, getAllPosts } from "../controller/post.js";
import { verifyToken, authorizeRoles } from "../middleware/auth.js";
import { cacheMiddleware } from "../middleware/cache.js";
const router = express.Router();
router.post(
  "/create",
  verifyToken,
  authorizeRoles("user", "admin"),
  createPost
);

router.get(
  "/get",
  verifyToken,
  authorizeRoles("user", "admin"),
  cacheMiddleware("post", 600),
  getAllPosts
);
export default router;
