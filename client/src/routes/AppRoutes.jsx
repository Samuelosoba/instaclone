import { createBrowserRouter, RouterProvider } from "react-router";
import { lazy, Suspense } from "react";
import { LazySpinner } from "../components/Spinner";
import Home from "../pages/home/Home";
import Register from "../pages/register/Register";
import Login from "../pages/login/Login";
import ForgetPassword from "../pages/forgetpassword/ForgetPassword";
import { PrivateRoutes, PublicRoutes, VerifyRoutes } from "./ProtectedRoutes";

// import accessToken from ""
import { useAuth } from "../store";
import SendVerifyMail from "../pages/verifyAccount/SendVerifyMail";
import VerifyAccount from "../pages/verifyAccount/VerifyAccount";
import ResetPassword from "../pages/forgetpassword/ResetPassword";
const AuthLayout = lazy(() => import("../layouts/AuthLayout"));
const RootLayout = lazy(() => import("../layouts/RootLayout"));
const VerifyAccountLayout = lazy(() =>
  import("../layouts/VerifyAccountLayout")
);

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
            <RootLayout />
          </PrivateRoutes>
        </Suspense>
      ),
      children: [
        {
          index: true,
          element: <Home />,
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
        { path: "verify-email", element: <SendVerifyMail /> },
        {
          path: "verify-email/:userId/:verificationToken",
          element: <VerifyAccount />,
        },
      ],
    },
  ];
  const router = createBrowserRouter(routes);
  return <RouterProvider router={router} />;
}
