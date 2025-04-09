import { toast } from "sonner";
const handleError = (error) => {
  console.log(error);
  if (error?.message === "Network Error") {
    return toast.error("Server is down, please try agin in a moment", {
      id: "Network-error",
    });
  }
  if (error) {
    return toast.error(
      error?.response?.data?.message ||
        error?.response?.data?.error ||
        error?.response?.data ||
        error?.message ||
        "An unexpected error has occured",
      { id: "response-Error" }
    );
  }
};
export default handleError;
