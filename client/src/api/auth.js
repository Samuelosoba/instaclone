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
  return await axiosInstance.post(
    "/auth/resend-verification-email",
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};
export const verifyEmailAccount = async (userId, verificationToken, token) => {
  return await axiosInstance.patch(
    `/auth/verify-account/${userId}/${verificationToken}`,
    {},
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
export const logout = async () => {
  return await axiosInstance.post("/auth/logout", {});
};
export const followUser = async (userId, token) => {
  return axiosInstance.patch(
    `/auth/follow/${userId}`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};
export const getAUser = async (username, token) => {
  return axiosInstance.get(`/auth/profile/${username}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
export const updateProfilePicture = async (image, token) => {
  return axiosInstance.patch(`/auth/updateProfilePicture/`, image, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const updateProfile = async (formData, token) => {
  return axiosInstance.patch(`/auth/update-profile`, formData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const getRandomUsers = async (token) => {
  return axiosInstance.get(`/auth/get-random-users`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const getUserFollowers = async (username, token) => {
  return axiosInstance.get(`/auth/followers/${username}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
export const getUserFollowing = async (username, token) => {
  return axiosInstance.get(`/auth/following/${username}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const updateUserPassword = async (formData, token) => {
  return axiosInstance.patch("/auth/update-password", formData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const updateUserPrivacy = async (formData, token) => {
  return axiosInstance.patch("/auth/update-privacy", formData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const deleteAccount = async (token) => {
  return axiosInstance.delete("/auth/delete-account", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const searchUsers = async (searchTerm, token) => {
  return await axiosInstance.get(`/auth/search?q=${searchTerm}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};