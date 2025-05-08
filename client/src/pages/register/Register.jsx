import Logo from "../../assets/logo1.svg";
import { Link, useNavigate } from "react-router";
import { useForm } from "react-hook-form";

import {
  validateEmail,
  validatefullname,
  validatePassword,
  validateUsername,
} from "../../utils/formvalidate";
import { useState } from "react";
import MetaArgs from "../../components/MetaArgs";
import { registerUser } from "../../api/auth";
import { toast } from "sonner";
import { useAuth } from "../../store";
import handleError from "../../utils/handleError";
export default function Register() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();
  const { setAccessToken } = useAuth();
  const navigate = useNavigate();

  const [revealPassword, setRevealPassword] = useState(false);
  const togglePassword = () => {
    setRevealPassword((prev) => !prev);
  };
  const onFormSubmit = async (data) => {
    try {
      const res = await registerUser(data);

      if (res.status === 201) {
        toast.success(res.data.message);
        setAccessToken(res.data.accessToken);
        navigate("/");
      }
    } catch (error) {
      handleError(error);
    }
  };
  return (
    <div className="">
      <MetaArgs
        title="Sign up to Instahots"
        content="Get access to InstaShots"
      />
      <div className="  border rounded-md border-[#A1A1A1] py-[40px] px-[28px]">
        <div className="flex justify-center">
          <Link to="/">
            <img src={Logo} />
          </Link>
        </div>
        <form
          className="md:max-w-[400px] mx-auto mt-10"
          onSubmit={handleSubmit(onFormSubmit)}
        >
          <div className="mb-4">
            {" "}
            <label className="floating-label">
              <span>Email</span>
              <input
                type="email"
                placeholder="Email"
                className="input input-lg w-full"
                id="email"
                {...register("email", {
                  validate: validateEmail,
                })}
              />
            </label>
            {errors.email && (
              <span className="text-xs text-red-600">
                {errors.email.message}
              </span>
            )}
          </div>
          <div className="mb-4">
            {" "}
            <label className="floating-label">
              <span>Full Name</span>
              <input
                type="text"
                placeholder="Full Name"
                className="input input-lg w-full"
                id="fullname"
                {...register("fullname", {
                  validate: validatefullname,
                })}
              />
            </label>
            {errors.fullname && (
              <span className="text-xs text-red-600">
                {errors.fullname.message}
              </span>
            )}
          </div>
          <div className="mb-4">
            {" "}
            <label className="floating-label">
              <span>Username</span>
              <input
                type="text"
                placeholder="Username"
                className="input input-lg w-full"
                id="username"
                {...register("username", {
                  validate: validateUsername,
                })}
              />
            </label>
            {errors.username && (
              <span className="text-xs text-red-600">
                {errors.username.message}
              </span>
            )}
          </div>
          <div className="mb-4 relative">
            {" "}
            <label className="floating-label">
              <span>Password</span>
              <input
                type={revealPassword ? "text" : "password"}
                placeholder="Password"
                className="input input-lg w-full"
                id="password"
                {...register("password", {
                  validate: validatePassword,
                })}
              />
            </label>
            <button
              className="absolute inset-y-0 right-2"
              onClick={togglePassword}
              type="button"
            >
              {" "}
              {revealPassword ? "hide" : "show"}
            </button>
          </div>
          {errors.password && (
            <span className="text-xs text-red-600">
              {errors.password.message}
            </span>
          )}
          <button
            className="btn btn-secondary btn-lg w-full mt-4 bg-[#8D0D76] mb-4"
            type="submit"
          >
            Sign up
          </button>
          <p className="text-center text-xl">
            By signing up you agree to Term, data and Policy
          </p>
        </form>
      </div>
      <div className=" md:w-[500px] h-[80px] border rounded-md border-[#A1A1A1] mt-6 flex items-center justify-center py-6">
        <p className="text-[20px] mr-2">Already have an account? </p>{" "}
        <Link to="/auth/login" className="text-[#8D0D76] text-bold text-[20px]">
          log in
        </Link>
      </div>
    </div>
  );
}
