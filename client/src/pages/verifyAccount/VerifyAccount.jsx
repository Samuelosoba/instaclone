import React, { useState } from "react";
import { useAuth } from "../../store";
import { resendEmailVerificationLink } from "../../api/auth";
import handleError from "../../utils/handleError";

export default function VerifyAccount() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuth();
  const resendMail = async () => {
    setIsSubmitting(true);
    try {
      const res = await resendEmailVerificationLink();
      if (res.status === 200) {
        toast.success(res.data.message);
      }
    } catch (error) {
      handleError(error);
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <div className="flex justify-center items-center min-h-screen flex-col text-center">
      <h1 className="text-4xl font-bold">Hi {user?.fullname}</h1>
      <p className="text-xl font-medium mt-2">
        You are yet to verify your email
      </p>
      <p className="mb-4">
        Please click the button below to send a new verification email
      </p>
      <form>
        <button type="submit" className="btn bg-[#8D0D76] w-[250px] text-white">
          Send new verification email
        </button>
      </form>
      <p className="mt-4 text-sm">
        If you have not recieved a verification mail, please check your spam,
        junk folder. You will be automatically logged out in 30mins if you have
        not verified your email
      </p>
    </div>
  );
}
