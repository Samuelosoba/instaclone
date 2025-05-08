import { useEffect, useState } from "react";
import { PostContext, useAuth } from ".";
import { getAllPosts } from "../api/post";
import useFetch from "../hooks/useFetch";
export default function PostProvider({ children }) {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(3);
  const { accessToken } = useAuth();
  const { data, setData, loading, error } = useFetch({
    apiCall: getAllPosts,
    params: [page, limit, accessToken],
  });
  const [posts, setPosts] = useState([]);
  useEffect(() => {
    if (data.success) {
      setPosts(data.posts);
    }
  }, [data.posts, data.success]);
  // useEffect(() => {
  //   if (!accessToken) return;
  //   const controller = new AbortController(); ///read more on this and react query
  //   const fetchPosts = async () => {
  //     setLoading(true);
  //     try {
  //       const res = await getAllPosts(page, limit, accessToken, {
  //         signal: controller.signal,
  //       });
  //       console.log(res);

  //       //fetch data if current page was not exited
  //       if (!controller.signal.aborted) {
  //         setPosts((prev) =>
  //           page === 1 ? res.data.posts : [...prev, ...res.data.posts]
  //         );
  //       }
  //     } catch (error) {
  //       //handle error not coming from the abort controller
  //       if (!controller.signal.aborted && error.name !== "AbortError") {
  //         handleError(error);
  //       }
  //     } finally {
  //       if (!controller.signal.aborted) {
  //         setLoading(false);
  //       }
  //     }
  //   };
  //   fetchPosts();
  //   return () => {
  //     controller.abort();
  //   };
  // }, [accessToken, page, limit]);
  console.log(posts);

  return (
    <PostContext.Provider
      value={{
        posts,
        setPosts,
        setPage,
        setLimit,
        setData,
        loading,
        data,
        page,
        error,
      }}
    >
      {children}
    </PostContext.Provider>
  );
}
