import axiosInstance from "../utils/axiosinstance";
export const createPost = async (formData, accessToken) => {
  return await axiosInstance.post("/post/create", formData, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
};
export const getAllPosts = async (page, limit, accessToken) => {
  return await axiosInstance.get(`/post/get?page=${page} &limit=${limit}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
};
