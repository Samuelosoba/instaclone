import { Outlet } from "react-router";
import { useAuth } from "../store";


export default function VerifyAccountLayout() {
  const { user } = useAuth();
  return (
    <div className="max-w-[750px] mx-auto py-6 px-4">
      <Outlet />
    </div>
  );
}
