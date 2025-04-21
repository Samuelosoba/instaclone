import { useNavigate, useParams } from "react-router";
import { verifyEmailAccount } from "../../api/auth";
import { useAuth } from "../../store";
import { useEffect, useState } from "react";
import handleError from "../../utils/handleError";
import MetaArgs from "../../components/MetaArgs";
import { DataSpinner } from "../../components/Spinner";
export default function VerifyAccount() {
  const [isSuccess, setIsSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { userId, verificationToken } = useParams();
  const { accessToken } = useAuth();
  const navigate = useNavigate();
  useEffect(() => {
    let isMounted = true;
    const verify = async () => {
      try {
        const res = await verifyEmailAccount(
          userId,
          verificationToken,
          accessToken
        );
        if (isMounted && res.status === 200) {
          setIsSuccess(res.data.success);
          toast.success(res.data.message, { id: "verifySuccess" });
          setTimeout(() => (window.location.href = "/"), 1500);
        }
      } catch (error) {
        if (isMounted) {
          handleError(error);
        }
      }
    };
    verify();
    return () => {
      isMounted = false;
    };
  }, [accessToken, userId, verificationToken]);
  if (isLoading) {
    return <DataSpinner />;
  }
  return (
    <>
      <MetaArgs
        title="verify your email Account"
        content="verify your email Account"
      />
      <div className="flex justify-center flex-col items-center min-h-screen gap-4">
        {isSuccess ? (
          <>
            <h1 className="text-2xl">
              You have successfully verified your account
            </h1>

            <p className="text-gray-600">Redirecting you to the home page</p>
          </>
        ) : (
          <>
            <h1 className="text-2xl ">
              There was a problem verifying your account
            </h1>
            <button
              className="btn bg-[#8D0D76] w-[250px] text-white"
              onClick={() => navigate("/verify-email")}
            >
              Try again
            </button>
          </>
        )}
      </div>
    </>
  );
}
