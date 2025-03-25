import Logo from "../../assets/logo.png";
import { Link } from "react-router";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { validatePassword, validateUsername } from "../../utils/formvalidate";

export default function Login() {
  console.log(validateUsername(""));
  console.log(validateUsername("ab"));

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();
  const [revealPassword, setRevealPassword] = useState(false);
  const togglePassword = () => {
    setRevealPassword((prev) => !prev);
  };
  const onSubmit = (data) => {
    console.log("form data", data);
    console.log("errors", errors);
  };
  return (
    <div className="">
      <div className="w-[90vw] md:w-[500px]  border rounded-md border-[#A1A1A1] py-[40px] px-[28px]">
        <div className="flex justify-center">
          <Link to="/">
            <img src={Logo} />
          </Link>
        </div>
        <form
          className="md:max-w-[400px] mx-auto mt-10"
          onSubmit={handleSubmit(onSubmit)}
        >
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
                  validate: (value) => validatePassword(value),
                })}
              />
            </label>
            <button
              className="absolute inset-y-0 right-2"
              onClick={togglePassword}
              type="button"
            >
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
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <span className="loading loading-spinner loading-md"></span>
            ) : (
              "Login"
            )}
          </button>
          <p className="text-center">
            {" "}
            <Link to="/auth/forgot-password"> Forgot Password?</Link>
          </p>
        </form>
      </div>
      <div className="w-[90vw] md:w-[500px] h-[80px] border rounded-md border-[#A1A1A1] mt-6 flex items-center justify-center py-4">
        <p className="text-[20px] mr-2">Dont have an account? </p>{" "}
        <Link
          to="/auth/register"
          className="text-[#8D0D76] text-bold text-[20px]"
        >
          Sign up
        </Link>
      </div>
    </div>
  );
}
