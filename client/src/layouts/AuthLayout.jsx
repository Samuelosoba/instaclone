import { Outlet, useLocation } from "react-router";
import AuthImage from "../assets/AuthImage.png";

export default function AuthLayout() {
  const location = useLocation();
  const isForgotPassword = location.pathname === "/auth/forgot-password";
  return (
    <section className=" flex mx-auto mt-20 justify-center min-h-screen max-w-[850px]">
      {!isForgotPassword && (
        <div className="hidden lg:block  mx-auto h-[500px] lg:w-[350px]">
          <img src={AuthImage} alt="AuthImage" className="rounded-md h-full w-full" />
        </div>
      )}
      <div className="md:w-[50%]">
        <Outlet />
      </div>
    </section>
  );
}
