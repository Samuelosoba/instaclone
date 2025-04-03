import Logo from "../../assets/logo.png";
import { validateEmail } from "../../utils/formvalidate";
import { useForm } from "react-hook-form";
import { Link } from "react-router";

export default function ForgetPassword() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();
  return (
    <div className=" md:w-[500px]   border rounded-md border-[#A1A1A1] py-[40px] px-[28px] mx-auto">
      <div className="flex justify-center mb-4">
        <Link to="/">
          <img src={Logo} />
        </Link>
      </div>
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
          <span className="text-xs text-red-600">{errors.email.message}</span>
        )}
      </div>
      <button
        className="btn btn-secondary btn-lg w-full mt-4 bg-[#8D0D76] mb-4"
        type="submit"
      >
        Continue
      </button>
    </div>
  );
}
