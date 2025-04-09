import { useForm } from "react-hook-form";
import { Link, useNavigate, useParams } from "react-router";
import MetaArgs from "../../components/MetaArgs";
import { validatePassword } from "../../utils/formvalidate"; 
import { useState } from "react";
import { toast } from "sonner";
import handleError from "../../utils/handleError";
import { resetPassword } from "../../api/auth";

const ResetPassword = () => {
  const { userId, passwordToken } = useParams();
  const [revealPassword, setRevealPassword] = useState(false);
  const [confirmPassword, setconfirmPassword] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();

  const navigate = useNavigate();

  const togglePassword1 = () => {
    setRevealPassword((prev) => !prev);
  };
  const togglePassword2 = () => {
    setconfirmPassword((prev) => !prev);
  };

  const formSubmit = async (data) => {
    if (data.newPassword !== data.confirmPassword) {
      toast.error("New password and confirm password do not match", {
        id: "Resetpassword",
      });
      return;
    }

    try {
      const res = await resetPassword(userId, passwordToken, data);
      if (res.status === 200) {
        toast.success(res.data.message);
        navigate("/auth/login");
      }
    } catch (error) {
      handleError(error);
    }
  };

  return (
    <>
      <MetaArgs
        title="Reset your InstaShot password"
        content="reset password page"
      />
      <div className="w-[90vw] md:w-[350px] border rounded-md border-[#A1A1A1] py-[40px] px-[28px]">
        <form
          className="md:max-w-[350px] mx-auto"
          onSubmit={handleSubmit(formSubmit)}
        >
          <div className="text-center mb-4">
            <div>
              <i className="ri-lock-unlock-line text-5xl"></i>
            </div>
            <h2 className="text-2xl text-[#827D7D] mt-4">Reset Password</h2>
          </div>
          <div className="mb-5 relative">
            <label className="floating-label">
              <span>New Password</span>
              <input
                type={revealPassword ? "text" : "password"}
                placeholder="New Password"
                className="input input-lg w-full"
                id="newPassword"
                {...register("newPassword", {
                  validate: (value) =>
                    validatePassword(value, "New password is required"),
                })}
              />
              <button
                className="absolute inset-y-0 right-2 cursor-pointer"
                onClick={togglePassword1}
                type="button"
              >
                {revealPassword ? "Hide" : "Show"}
              </button>
            </label>

            {errors.newPassword && (
              <span className="text-sm text-red-600">
                {errors.newPassword.message}
              </span>
            )}
          </div>

          <div className="mb-5 relative">
            <label className="floating-label">
              <span>Confirm Password</span>
              <input
                type={confirmPassword ? "text" : "password"}
                placeholder="Confirm Password"
                className="input input-lg w-full"
                id="confirmPassword"
                {...register("confirmPassword", {
                  validate: (value) =>
                    validatePassword(value, "Confirm password is required"),
                })}
              />
              <button
                className="absolute inset-y-0 right-2 cursor-pointer"
                onClick={togglePassword2}
                type="button"
              >
                {confirmPassword ? "Hide" : "Show"}
              </button>
            </label>

            {errors.confirmPassword && (
              <span className="text-sm text-red-600">
                Confirm password is required
              </span>
            )}
          </div>

          <button
            className="btn w-full text-white bg-[#8D0D76] hover:bg-[#8d0d76cb]"
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <span className="loading loading-spinner"></span>
            ) : (
              "Reset"
            )}
          </button>
        </form>
      </div>
      <div className="w-[90vw] md:w-[350px] border rounded-md border-[#A1A1A1] py-[18px] px-[8px] mt-5 text-center">
        <span>Already have an account? </span>
        <Link
          to="/auth/login"
          className="cursor-pointer text-[#8D0D76] font-bold"
        >
          Login
        </Link>
      </div>
    </>
  );
};

export default ResetPassword;
