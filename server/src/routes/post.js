import express from "express";
import {
  createPost,
  getAllPosts,
  handleLikePost,
  seeWhoLikedPost,
  handleSavePost,
  getAPost,
  deletePost,
  updatePost,
  getPostsByTags,
  explorePosts,
} from "../controller/post.js";
import { verifyToken, authorizeRoles } from "../middleware/auth.js";
import { cacheMiddleware, clearCache } from "../middleware/cache.js";
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
  cacheMiddleware("posts", 600),
  getAllPosts
);
router.patch(
  "/like/:id",
  verifyToken,
  authorizeRoles("user", "admin"),
  (req, res, next) => {
    clearCache("posts"); //clear user info
    clearCache("post");
    next();
  },
  handleLikePost
);
router.patch(
  "/save/:id",
  verifyToken,
  authorizeRoles("user", "admin"),
  (req, res, next) => {
    clearCache("posts"); //clear user info
    clearCache("post");
    next();
  },
  handleSavePost
);
router.get(
  "/see-who-liked/:id",
  verifyToken,
  authorizeRoles("user", "admin"),
  cacheMiddleware("seeLikes", 600),
  seeWhoLikedPost
);
router.get(
  "/get/:id",
  verifyToken,
  authorizeRoles("user", "admin"),
  cacheMiddleware("post"),
  getAPost
);
router.delete(
  "/delete/:id",
  verifyToken,
  authorizeRoles("user", "admin"),
  (req, res, next) => {
    clearCache("posts"); //clear previous post
    next();
  },
  deletePost
);
router.patch(
  "/update/:id",
  verifyToken,
  authorizeRoles("user", "admin"),
  (req, res, next) => {
    clearCache("posts"); //populate user with new data
    next();
  },
  updatePost
);

router.get(
  "/explore",
  verifyToken,
  authorizeRoles("user", "admin"),
  cacheMiddleware("explore", 60),
  explorePosts
);

router.get(
  "/get-posts-tags/:tags",
  verifyToken,
  authorizeRoles("user", "admin"),
  cacheMiddleware("explore", 600),
  getPostsByTags
);
export default router;
