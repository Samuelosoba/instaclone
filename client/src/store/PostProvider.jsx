import { useEffect, useState } from "react";
import { PostContext, useAuth } from ".";
import { getAllPosts } from "../api/post";
import handleError from "../utils/handleError";
export default function PostProvider({ children }) {
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { accessToken } = useAuth();
  useEffect(() => {
    if (!accessToken) return;
    const controller = new AbortController(); ///read more on this and react query
    const fetchPosts = async () => {
      setLoading(true);
      try {
        const res = await getAllPosts(page, limit, accessToken, {
          signal: controller.signal,
        });
        console.log(res);
        
        //fetch data if current page was not exited
        if (!controller.signal.aborted) {
          setPosts((prev) =>
            page === 1 ? res.data.posts : [...prev, ...res.data.posts]
          );
        }
      } catch (error) {
        //handle error not coming from the abort controller
        if (!controller.signal.aborted && error.name !== "AbortError") {
          handleError(error);
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    };
    fetchPosts();
    return () => {
      controller.abort();
    };
  }, [accessToken, page, limit]);
  console.log(posts);
  
  return (
    <PostContext.Provider value={{ posts, setPosts,loading,error,setPosts }}>
      {children}
    </PostContext.Provider>
  );
}
