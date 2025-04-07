import AppRoutes from "./routes/AppRoutes";
import { HelmetProvider } from "react-helmet-async";
import { Toaster } from "sonner";
import { useAuth } from "./store";
import { LazySpinner } from "./components/Spinner";

function App() {

  return (
    <HelmetProvider>
      <Toaster position="top-center" expand={true} richColors />
      <AppRoutes />
    </HelmetProvider>
  );
}

export default App;
