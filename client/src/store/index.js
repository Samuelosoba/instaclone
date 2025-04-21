import { createContext, useContext } from "react";

export const AuthContext = createContext({});
export const PostContext = createContext({});
export const useAuth = () => {
  const authStore = useContext(AuthContext);
  if (authStore === undefined) {
    throw new Error("useAuth must be defined within an Authprovider");
  }
  return authStore;
};
export const usePost = () => {
  const postStore = useContext(PostContext);
  if (postStore === undefined) {
    throw new Error("usePost must be defined within an Authprovider");
  }
  return postStore;
};
