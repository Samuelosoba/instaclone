import Post from "../model/post.js";
import createHttpError from "http-errors";
import {
  uploadToCloudinary,
  deleteFromCloudinary,
} from "../config/cloudinary.js";

export const createPost = async (req, res, next) => {
  const { caption, description, media, tags, isPublic } = req.body;
  console.log(media);
  const { id: userId } = req.user;
  if (!caption || media.length === 0) {
    return next(
      createHttpError(400, "Caption, and at least one media file is required")
    );
  }
  //create varaibles for mediaFiles and mediaResults response
  let mediaFiles;
  let mediaResults;
  try {
    //handle upload to cloudinary
    mediaFiles = async (files) => {
      const results = await Promise.all(
        files.map((file) =>
          uploadToCloudinary(file, {
            folder: "Instashots/posts",
            transformation: [
              { quality: "auto" },
              { fetch_format: "auto" },
              { height: 550 },
            ],
          })
        )
      );
      console.log(results);

      return {
        urls: results.map((result) => result.url),
        ids: results.map((result) => result.public_id),
      };
    };
    mediaResults = await mediaFiles(media); //our cloudinary rreturned response

    //proceed to creating our post
    const post = await Post.create({
      userId: userId,
      caption,
      description,
      tags,
      isPublic,
      media: mediaResults.urls,
      mediaPublicIds: mediaResults.ids,
    });
    res.status(201).json({
      success: true,
      message: "Post created successfully",
      post,
    });
  } catch (error) {
    //delete media uploaded to cloudinary if post creation failed
    const deleteMedia = async () => {
      if (mediaResults && mediaResults.ids) {
        return Promise.all(
          mediaResults.ids.map((id) => deleteFromCloudinary(id))
        );
      }
    };
    await deleteMedia();
    next(error);
  }
};
export const getAllPosts = async (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10; //limit data fetch to 10 items per page
  const skip = (page - 1) * limit;
  const totalPosts = await Post.countDocuments(); //gets total number of posts
  const totalPages = Math.ceil(totalPosts / limit);
  try {
    const posts = await Post.find()
      .populate("userId", "username profilePicture")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
    res.status(200).json({
      success: true,
      posts,
      pagination: {
        currentPage: page,
        totalPages,
        totalPosts,
        hasMore: skip + posts.length < totalPosts,
      },
    });
  } catch (error) {
    next(error);
  }
};
