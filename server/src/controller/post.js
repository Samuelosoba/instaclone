import Post from "../model/post.js";
import createHttpError from "http-errors";
import User from "../model/user.js";
import {
  uploadToCloudinary,
  deleteFromCloudinary,
} from "../config/cloudinary.js";
import Comment from "../model/comment.js";

export const createPost = async (req, res, next) => {
  const { caption, description, media, tags, isPublic } = req.body;
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
    const populatePost = await Post.findById(post._id).populate(
      "userId",
      "username profilePicture"
    );
    res.status(201).json({
      success: true,
      message: "Post created successfully",
      post: populatePost,
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
      .populate("likes", "username profilePicture")
      .populate("savedBy", "username profilePicture")
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
// These api call is to enable user like and unlike,
export const handleLikePost = async (req, res, next) => {
  const { id: postId } = req.params;
  const { id: userId } = req.user;
  try {
    if (!postId) {
      return next(createHttpError(400, "Post params is required"));
    }
    //find the post (this eable the server to request the post to be liked)
    const post = await Post.findById(postId);
    if (!post) {
      return next(createHttpError(404, "Post not found"));
    }
    //check the likes(NB: Our likes is an array, hence we need to map over) field to see if user (userId) has already liked the post
    if (post.likes.map((id) => id.toString()).includes(userId)) {
      post.likes = post.likes.filter((id) => id.toString() !== userId); //Unlikin the post (that is removing userId from the like array)
    } else {
      post.likes.push(userId); //like a post if userId is not the likes array
    }
    await post.save(); //this is to save a post
    //populat userId in the likes array with extra data before sending response
    const populatePost = await Post.findById(post._id)
      .populate(
        "userId",
        "username profilePicture"
        // the above is to enable us get both the userId aswell as the username and profilePictues of users.
      )
      .populate("likes", "username profilePicture");
    res.status(200).json({
      success: true,
      message: populatePost.likes.some((id) => id._id.toString() === userId)
        ? "Post liked"
        : "Post unliked",
      post: populatePost,
    });
  } catch (error) {
    next(error);
  }
};

//this is another api
export const seeWhoLikedPost = async (req, res, next) => {
  const { id: postId } = req.params;
  try {
    if (!postId) {
      return next(createHttpError(400, "Post params is required"));
    }
    const post = await Post.findById(postId).sort({ createdAt: -1 });
    if (!post) {
      return next(createHttpError(404, "Post not found"));
    }
    //find each user in likes array of post
    const getUsers = post.likes.map((id) =>
      User.findById(id).select(
        "id username profilePicture fullname followers following"
      )
    );
    const users = await Promise.all(getUsers);
    res.status(200).json({
      success: true,
      users,
    });
  } catch (error) {
    next(error);
  }
};

export const handleSavePost = async (req, res, next) => {
  const { id: postId } = req.params;
  const { id: userId } = req.user;
  try {
    if (!postId) {
      return next(createHttpError(400, "Post params is required"));
    }
    //find the post (this eable the server to request the post to be liked)
    const post = await Post.findById(postId);
    if (!post) {
      return next(createHttpError(404, "Post not found"));
    }
    //check the savedBy(NB: Our savedBy is an array, hence we need to map over) field to see if user (userId) has already liked the post
    if (post.savedBy.map((id) => id.toString()).includes(userId)) {
      post.savedBy = post.savedBy.filter((id) => id.toString() !== userId); //Unlikin the post (that is removing userId from the like array)
    } else {
      post.savedBy.push(userId); //like a post if userId is not the savedBy array
    }
    await post.save(); //this is to save a post
    //populat userId in the savedBy array with extra data before sending response
    const populatePost = await Post.findById(post._id)
      .populate(
        "userId",
        "username profilePicture"
        // the above is to enable us get both the userId aswell as the username and profilePictues of users.
      )
      .populate("savedBy", "username profilePicture");
    res.status(200).json({
      success: true,
      message: populatePost.savedBy.some((id) => id._id.toString() === userId)
        ? "Post saved"
        : "Post unsaved",
      post: populatePost,
    });
  } catch (error) {
    next(error);
  }
};
export const getAPost = async (req, res, next) => {
  const { id: postId } = req.params;
  try {
    if (!postId) {
      return next(createHttpError(400, "Post id is required"));
    }
    const [post, comments] = await Promise.all([
      await Post.findById(postId)
        .populate("userId", "username profilePicture")
        .populate("likes", "username profilePicture")
        .populate("savedBy", "username profilePicture"),
      await Comment.find({ postId })
        .populate("user", "username profilePicture")
        .sort({ createdAt: -1 }),
    ]);
    if (!post) {
      return next(createHttpError(404, "Post not found"));
    }
    res.status(200).json({
      success: true,
      post,
      comments,
    });
  } catch (error) {
    next(error);
  }
};
export const deletePost = async (req, res, next) => {
  const { id: postId } = req.params;
  const { id: userId } = req.user;

  try {
    if (!postId) {
      return next(createHttpError(400, "Post id is required"));
    }
    const post = await Post.findById(postId);
    if (!postId) {
      return next(createHttpError(404, "Post not Found"));
    }
    if (post.userId.toString() !== userId) {
      return next(createHttpError(401, "Unathorized, You cannot delete Post"));
    }
    //delete from cloudinary
    for (const publicIds of post.mediaPublicIds) {
      await deleteFromCloudinary(publicIds);
    }
    //delete post and assiociated comments
    const deletePromises = [];
    deletePromises.push(
      Post.findByIdAndDelete(postId),
      Comment.deleteMany({ postId: postId })
    );
    await Promise.all(deletePromises);
    res.status(200).json({
      success: true,
      message: "Post deleted",
    });
  } catch (error) {
    next(error);
  }
};

export const updatePost = async (req, res, next) => {
  const { id: postId } = req.params;
  const { id: userId } = req.user;
  const { caption, description, tags } = req.body;

  try {
    if (!postId) {
      return next(createHttpError(400, "Post id is required"));
    }
    const post = await Post.findById(postId);
    if (!post) {
      return next(createHttpError(404, "Post not found"));
    }
    if (post.userId.toString() !== userId) {
      return next(createHttpError(401, "Unauthorized to perform this request"));
    }

    const updateDate = {
      caption: caption || post.caption,
      description: description || post.description,
      tags: tags || post.tags,
    };

    const updatePost = await Post.findByIdAndUpdate(post, updateDate, {
      new: true,
    }).populate("userId", "username profilePicture");

    res.status(200).json({
      success: true,
      message: "Post updated",
      post: updatePost,
    });
  } catch (error) {
    next(error);
  }
};

export const explorePosts = async (req, res, next) => {
  const { id: userId } = req.user;
  try {
    // Get user's own posts to exclude them
    const userPosts = await Post.find({ userId });
    const userPostIds = userPosts.map((post) => post._id);

    // Get random posts excluding user's own posts
    const randomPosts = await Post.find({
      _id: { $nin: userPostIds },
    })
      .populate("userId", "username fullname profilePicture")
      .sort({ createdAt: -1 })
      .limit(10);

    res.status(200).json({
      success: true,
      randomPosts,
    });
  } catch (error) {
    next(error);
  }
};

export const getPostsByTags = async (req, res, next) => {
  const { tags } = req.params;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;
  const totalPosts = await Post.countDocuments({
    tags: { $in: tags.split(",") },
  });
  const totalPages = Math.ceil(totalPosts / limit);
  try {
    const posts = await Post.find({ tags: { $in: tags.split(",") } })
      .populate("userId", "username profilePicture")
      .populate("likes", "username profilePicture")
      .populate("savedBy", "username profilePicture")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
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

//populate (means to add other things)
//when dealing with anything that has to do with search, we should use req.querry
// if youre trying to perfoerm more than one api calls, we should use promise
