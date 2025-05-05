import { useLocation, useParams, useNavigate, Link } from "react-router";
import { useState, useEffect } from "react";
import Modal from "../../components/Modal";
import useFetch from "../../hooks/useFetch";
import { getAPost, deletePost } from "../../api/post";
import { useAuth } from "../../store";
import MetaArgs from "../../components/MetaArgs";
import useSlideControl from "../../hooks/useSlideControl";
import LazyLoadComponent from "../../components/LazyLoadComponent";
import TimeAgo from "timeago-react";
import { useForm } from "react-hook-form";
import handleError from "../../utils/handleError";
import { toast } from "sonner";
import { createComment, deleteComment } from "../../api/comment";

export default function Comments() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [optionsModal, setOptionsModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm();
  const path = location.pathname === `/post/${id}`;
  const { accessToken, user } = useAuth();
  const { data, setData } = useFetch({
    apiCall: getAPost,
    params: [id, accessToken],
  });

  const { comments, post } = data ?? {};
  //this is a reusable hook
  const { currentImageIndex, handlePrevious, handleNext } = useSlideControl(
    post?.media
  );

  console.log(data);
  useEffect(() => {
    if (path) {
      setIsModalOpen(true);
    } else {
      setIsModalOpen(false);
      navigate("/");
    }
  }, [path]);

  const handleClose = () => {
    setIsModalOpen(false);
    navigate("/");
  };

  const formatTime = (time) => {
    return <TimeAgo datetime={time} locale="en-US" />;
  };
  const deleteAPost = async () => {
    setLoading(true);
    try {
      const res = await deletePost(id, accessToken);
      if (res.status == 200) {
        toast.success(res.data.message);
        navigate("/");
      }
    } catch (error) {
      handleError(error);
    } finally {
      setLoading(false);
    }
  };
  const postComment = async (data) => {
    try {
      const res = await createComment(id, data, accessToken);
      if (res.status === 201) {
        toast.success(res.data.message);
        reset({ comment: "" });
        setData((prev) => ({
          ...prev,
          comments: [res.data.comment, ...(prev?.comments || [])],
        }));
      }
    } catch (error) {
      handleError(error);
    }
  };
  const deleteUserComment = async (commentId) => {
    setLoading(true);
    try {
      const res = await deleteComment(commentId, accessToken);
      if (res.status === 200) {
        toast.success(res.data.message);
        setData((prev) => ({
          ...prev,
          comments: prev.comments.filter((c) => c._id !== commentId),
        }));
      }
    } catch (error) {
      handleError(error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <>
      <MetaArgs
        title={`${post?.userId?.username} - ${post?.caption}`}
        content="view post details"
      />
      <Modal
        isOpen={isModalOpen}
        id="postModalComment"
        classname="w-[90%] max-w-[1024px] mx-auto p-0"
      >
        <button
          className="btn btn-sm btn-circlee btn-ghost absolute right-2 top-2
          z-30"
          type="button"
          onClick={handleClose}
        >
          <i className="ri-close-line text-xl"></i>
        </button>
        <div className="grid grid-cols-12 h-[700px]">
          <div className="col-span-12 lg:col-span-6">
            <figure className="relative overflow-hidden">
              {post?.media.map((item, index) => (
                <div
                  key={index}
                  className={`transistion-transform duration-300 ease-in-out transform ${
                    index === currentImageIndex
                      ? "fade-enter fade-enter-active"
                      : "fade-exit fade-exit-active"
                  }`}
                >
                  {index === currentImageIndex && (
                    <>
                      {item.endsWith(".mp4") || item.endsWith("webm") ? (
                        <>
                          <video
                            src={item}
                            controls={false}
                            loop
                            playsInline
                            autoPlay
                            className="w-full h-auto lg:h-[550px] object-cover
                            aspect-square md:rounded-md"
                          />
                        </>
                      ) : (
                        <LazyLoadComponent
                          image={item}
                          classname="w-full h-[300px] lg:h-[700px] object-cover
                          aspect-square shrink-0"
                        />
                      )}
                    </>
                  )}
                </div>
              ))}
              <>
                {currentImageIndex < post?.media?.length - 1 && (
                  <button
                    onClick={handleNext}
                    className="abolute right-2 top-1/2 btn btn-circle btn-sm opacity-75 hover:opacity-100"
                  >
                    <i className="ri-arrow-right-s-line text-lg"></i>
                  </button>
                )}
              </>
              <>
                {currentImageIndex > 0 && (
                  <button
                    onClick={handlePrevious}
                    className="absolute left-2 top-1/2 btn btn-circle btn-sm opacity-75 hover:opacity-100"
                  >
                    <i className="ri-arrow-left-s-line text-lg"></i>
                  </button>
                )}
              </>
              {post?.media?.length > 1 && (
                <div className="absolute bottom-4 left-1/2 transform-translate-x-1/2 flex gap-3">
                  {post?.media?.map((_, index) => (
                    <div
                      key={index}
                      className={`w-[8px] h-[8px] ronded-full ${
                        index === currentImageIndex
                          ? "bg-fuchsia-900"
                          : "bg-white"
                      }`}
                    />
                  ))}
                </div>
              )}
            </figure>
          </div>
          <div
            className="col-span-12 lg:col-span-6 lg:relative h-auto
          overflow-auto"
          >
            <div className="p-4 md:w-full mb-1 flex items-center justify-between border-b border-gray-300">
              <Link
                className="flex gap-2 items-center"
                to={`/profile/${post?.userId?.username}`}
              >
                <div className="avatar avatar-placeholder">
                  <div className="w-10 rounded-full border border-gray-300">
                    {post?.userId?.profilePicture ? (
                      <img
                        src={post?.userId?.profilePicture}
                        alt={post?.userId?.username}
                      />
                    ) : (
                      <span className="text-3xl">
                        {post?.userId?.username?.charAt(0)}
                      </span>
                    )}
                  </div>
                </div>
                <p className="font-bold">{post?.userId?.username}</p>
              </Link>
              {user?._id === post?.userId?._id && (
                <i
                  className="ri-more-line text-2xl cursor-pointer lg:mr-10"
                  role="button"
                  title="see options"
                  onClick={() => setOptionsModal(true)}
                ></i>
              )}
              <Modal
                isOpen={optionsModal}
                id="options_Modal"
                classname="w-[90%] max-w-[400px] mx-auto p-0"
                onClose={() => setOptionsModal(false)}
              >
                <div className="text-center p-3">
                  <p
                    onClick={deleteAPost}
                    className="cursor-pointer"
                    role="button"
                  >
                    {loading ? "Deleting.." : "Delete"}
                  </p>
                  <div className="divider my-2"></div>
                  <Link to={`/post/edit/${id}`}>Edit</Link>
                  <div className="divider my-2"></div>
                  <p
                    className="font-medium cursor-pointer"
                    role="button"
                    onClick={() => setOptionsModal(false)}
                  >
                    Cancel
                  </p>
                </div>
              </Modal>
            </div>
            <div className="mt-4 px-4 h-[500px] overflow-auto">
              <div className="flex items-start gap-3">
                <div className="avatar avatar-placeholder">
                  <div className="w-10 rounded-full border border-gray-300">
                    {post?.userId?.profilePicture ? (
                      <img
                        src={post?.userId?.profilePicture}
                        alt={post?.userId?.username}
                      />
                    ) : (
                      <span className="text-3xl">
                        {post?.userId?.username?.charAt(0)}
                      </span>
                    )}
                  </div>
                </div>
                <div>
                  <div>
                    <Link
                      to={`/profile/${post?.userId?.username}`}
                      className="text-sm font-bold mb-0 mr-2"
                    >
                      {post?.userId?.username}
                    </Link>
                    <span className="text-sm mb-0 font-medium">
                      {post?.caption}{" "}
                      {post?.description ? `- ${post?.description} ` : ""}
                    </span>
                  </div>
                  {post?.tags && (
                    <div className="flex flex-wrap items-center gap-2">
                      {post?.tags.map((tag, index) => (
                        <Link
                          to={`/tag/${tag}`}
                          className="text-fuchsia-900 text-sm"
                          key={index}
                        >
                          #{tag}
                        </Link>
                      ))}
                    </div>
                  )}
                  <p className="text-xs text-gray-500">
                    {formatTime(post?.createdAt)}
                  </p>
                </div>
              </div>
              {comments?.length === 0 && (
                <p className="text-center text-sm my-4">
                  No comments yet. Be the first to make a comment
                </p>
              )}
              {comments?.map((comment) => (
                <div key={comment._id} className="my-4 px-1">
                  <div className="flex gap-4">
                    <Link to={`/profile/${comment?.user?.username}`}>
                      <div className="avatar avatar-placeholder">
                        <div className="w-9 rounded-full border border-gray-300">
                          {comment?.user?.profilePicture ? (
                            <img
                              src={comment?.user?.profilePicture}
                              alt={comment?.user?.username}
                              loading="lazy"
                            />
                          ) : (
                            <span className="text-xl">
                              {comment?.user?.username?.charAt(0)}
                            </span>
                          )}
                        </div>
                      </div>
                    </Link>
                    <div className="flex-1">
                      <div>
                        <Link className="text-sm font-semibold mb-0 mr-2">
                          {comment?.user?.username}
                        </Link>
                        <span className="text-sm mb-0 font-medium">
                          {comment?.comment}
                        </span>
                      </div>
                      <div className="flex gap-2 items-center">
                        <p className="text-xs text-gray-500">
                          {formatTime(comment?.createdAt)}
                        </p>
                        <p className="text-xs text-gray-500">
                          {comment?.likes?.length} likes
                        </p>
                        {comment?.user?._id === user?._id && (
                          <i
                            className="ri-delete-bin-7-line cursor-pointer"
                            role="button"
                            title="Delete comment"
                            // for delete comment
                            onClick={() => deleteUserComment(comment._id)}
                          ></i>
                        )}
                      </div>
                    </div>

                    <i
                      //this is us giving it a special attribute, so when we like, it displays a different color
                      className={`${
                        comment?.likes?.includes(user?._id)
                          ? "ri-heart-fill text-red-700"
                          : "ri-heart-line"
                      }
                      cursor-pointer`}
                      role="buttom"
                    ></i>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-white relative z-30 w-full border-t border-gray-300 py-2">
              <div className="px-4 flex justify-between items-center ">
                <div className="flex gap-4 items-center">
                  <i
                    className={`${
                      post?.likes?.some((item) => item._id === user?._id)
                        ? "ri-heart-fill text-red-700"
                        : "ri-heart-line"
                    } cursor-pointer text-2xl`}
                    role="button"
                    title={
                      post?.likes?.some((item) => item._id === user?._id)
                        ? "Unlike"
                        : "Like"
                    }
                  ></i>
                  <label htmlFor="comment">
                    <i
                      className="ri-chat-3-line text-2xl cursor-pointer"
                      title="comment"
                    ></i>
                  </label>
                </div>
                <i
                  className={`${
                    post?.savedBy?.includes(user?._id)
                      ? "ri-bookmark-fill text-gray-900"
                      : "ri-heart-line"
                  } cursor-pointer text-2xl`}
                  role="button"
                  title={post?.savedBy?.includes(user?._id) ? "Unsave" : "Save"}
                ></i>
              </div>
              <div className="mt-2 px-4 flex gap-2">
                {post?.likes?.slice(0, 1).map((like, index) => (
                  <div key={index} className="flex gap-2 items-center">
                    <Link to={`/profile/${like?.username}`}>
                      <div className="avatar-group -space-x-6">
                        <div className="avatar avatar-placeholder rounded-full border border-gray-300">
                          <div className="w-5">
                            {like?.profilePicture ? (
                              <img
                                src={like?.profilePicture}
                                alt={like?.username}
                              />
                            ) : (
                              <span>{like?.username?.charAt(0)}</span>
                            )}
                          </div>
                        </div>
                      </div>
                    </Link>
                    <p className="text-sm">
                      liked by{""}
                      <Link
                        to={`/profile/${like?.username}`}
                        className="font-medium"
                      >
                        {like?.username}
                      </Link>{" "}
                      and <span>{post?.likes?.length - 1} others</span>
                    </p>
                  </div>
                ))}
              </div>
              <form
                className="relative px-4 mt-4"
                onSubmit={handleSubmit(postComment)}
              >
                <textarea
                  className="w-full border-0 h-[40px] focus:border-0 focus:outline-none text-sm"
                  placeholder="Add a comment..."
                  id="comment"
                  name="comment"
                  {...register("comment", { required: true })}
                ></textarea>
                <button
                  disabled={isSubmitting}
                  type="submit"
                  className="btn btn-ghost text-fuchsia-900 font-bold absolute inset-y-0 right-0"
                >
                  {isSubmitting ? "Posting.." : "Post"}
                </button>
                {errors?.comment && (
                  <p className="text-xs text-red-600 px-4">
                    Comment is required
                  </p>
                )}
              </form>
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
}
