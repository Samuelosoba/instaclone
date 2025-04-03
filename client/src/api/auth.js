import axiosInstance from "../utils/axiosinstance";
export const registerUser = async (formdata) => {
  return await axiosInstance.post("/auth/register", formdata);
};
export const loginUser = async (formdata) => {
  return await axiosInstance.post("/auth/login", formdata);
};
export const authenticateUser = async (token) => {
  return await axiosInstance.get("/auth/user", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
export const resendEmailVerificationLink = async (token) => {
  return await axiosInstance.get("/auth/resend-verification", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
export const verifyEmailAccount = async (userId, verificationToken, token) => {
  return await axiosInstance.patch(
    `/auth/verify-account/${userId}/${verificationToken}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};
export const sendForgotPasswordMail = async (formdata) => {
  return await axiosInstance.post("/auth/sendforgot-password-mail", formdata);
};
export const resetPassword = async (userId, passwordToken, formdata) => {
  return axiosInstance.patch(
    `/auth/reset-password/${userId}/${passwordToken}`,
    formdata
  );
};
