import { Outlet, useLocation } from "react-router";
import AuthImage from "../assets/AuthImage.png";

export default function AuthLayout() {
  const location = useLocation();
  const isForgotPassword = location.pathname === "/auth/forgot-password";
  return (
    <section className="container mx-auto grid grid-cols-12 items-center justify-center min-h-screen max-w-[850px]">
      {!isForgotPassword && (
        <div className="hidden lg:block col-span-6 mx-auto h-[500px] lg:w-[350px]">
          <img src={AuthImage} alt="AuthImage" className=""/>
        </div>
      )}
      <div className="col-span-12 lg:col-span-6 mx-auto">
        
        <Outlet />
      </div>
    </section>
  );
}
