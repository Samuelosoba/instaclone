import { createBrowserRouter, RouterProvider } from "react-router";
import { lazy, Suspense } from "react";
import { LazySpinner } from "../components/Spinner";
import Home from "../pages/home/Home";
import Register from "../pages/register/Register";
import Login from "../pages/login/Login";
import ForgetPassword from "../pages/forgetpassword/ForgetPassword";
import { PrivateRoutes, PublicRoutes, VerifyRoutes } from "./ProtectedRoutes";
import Comments from "../pages/comments/Comments";
import { useAuth } from "../store";
import SendVerifyMail from "../pages/verifyAccount/SendVerifyMail";
import VerifyAccount from "../pages/verifyAccount/VerifyAccount";
import ResetPassword from "../pages/forgetpassword/ResetPassword";
import PostProvider from "../store/PostProvider";
import EditPost from "../pages/editPosts/EditPost";
import Profile from "../pages/profile/Profile";
import Followers from "../pages/profile/followers/Followers";
import Following from "../pages/profile/following/Following";
import Tag from "../pages/tag/Tag";
import Settings from "../pages/settings/Settings";
import UpdatePassword from "../pages/settings/UpdatePassword";
import AccountPrivacy from "../pages/settings/AccountPrivacy";
import DeleteAccount from "../pages/settings/DeleteAccount";
import Explore from "../pages/explore/Explore";
const AuthLayout = lazy(() => import("../layouts/AuthLayout"));
const RootLayout = lazy(() => import("../layouts/RootLayout"));
const VerifyAccountLayout = lazy(() =>
  import("../layouts/VerifyAccountLayout")
);
const NotFoundPAge = lazy(() => import("../pages/NotFoundRoute"));
export default function AppRoutes() {
  const { accessToken, isCheckingAuth, user } = useAuth();
  if (isCheckingAuth) {
    return <LazySpinner />;
  }
  const routes = [
    {
      path: "auth",
      element: (
        <Suspense fallback={<LazySpinner />}>
          <PublicRoutes accessToken={accessToken}>
            <AuthLayout />
          </PublicRoutes>
        </Suspense>
      ),
      children: [
        {
          path: "register",
          element: <Register />,
        },
        {
          path: "login",
          element: <Login />,
        },
        {
          path: "forgot-password",
          element: <ForgetPassword />,
        },
        {
          path: "reset-password/:userId/:passwordToken",
          element: <ResetPassword />,
        },
      ],
    },
    {
      path: "/",
      element: (
        <Suspense fallback={<LazySpinner />}>
          <PrivateRoutes accessToken={accessToken} user={user}>
            <PostProvider>
              <RootLayout />
            </PostProvider>
          </PrivateRoutes>
        </Suspense>
      ),
      children: [
        {
          index: true,
          element: <Home />,
        },
        {
          path: "explore",
          element: <Explore />,
        },
        {
          path: "post/:id",
          element: <Comments />,
        },
        {
          path: "post/edit/:id",
          element: <EditPost />,
        },
        {
          path: "profile/:username",
          element: <Profile />,
        },
        {
          path: "profile/:username/followers",
          element: <Followers />,
        },
        {
          path: "profile/:username/following",
          element: <Following />,
        },
        {
          path: "tag/:tag",
          element: <Tag />,
        },
        {
          path: "settings",
          element: <Settings />,
          children: [
            {
              path: "update-password",
              element: <UpdatePassword />,
            },
            {
              path: "account-privacy",
              element: <AccountPrivacy />,
            },
            {
              path: "delete-account",
              element: <DeleteAccount />,
            },
          ],
        },
      ],
    },
    {
      element: (
        <Suspense fallback={<LazySpinner />}>
          <VerifyRoutes accessToken={accessToken} user={user}>
            <VerifyAccountLayout />
          </VerifyRoutes>
        </Suspense>
      ),
      children: [
        {
          path: "verify-email",
          element: <SendVerifyMail />,
        },
        {
          path: "verify-email/:userId/:verificationToken",
          element: <VerifyAccount />,
        },
      ],
    },
    {
      path: "*",
      element: (
        <Suspense fallback={<LazySpinner />}>
          <NotFoundPAge />
        </Suspense>
      ),
    },
  ];
  const router = createBrowserRouter(routes);
  return <RouterProvider router={router} />;
}
