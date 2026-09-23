import { useEffect } from "react";
import { AuthProvider } from "./context/AuthContext";
import AppRoutes from "./routes/AppRoutes";
import BotChat from "./components/chat/BotChat";

function App() {
  useEffect(() => {
    const handler = (event: ErrorEvent) => {
      console.error("[Global Error]", event.message, event.filename, event.lineno);
    };
    const rejectionHandler = (event: PromiseRejectionEvent) => {
      console.error("[Unhandled Rejection]", event.reason);
    };
    window.addEventListener("error", handler);
    window.addEventListener("unhandledrejection", rejectionHandler);
    return () => {
      window.removeEventListener("error", handler);
      window.removeEventListener("unhandledrejection", rejectionHandler);
    };
  }, []);

  return (
    <AuthProvider>
      <AppRoutes />
      <BotChat />
    </AuthProvider>
  );
}

export default App;
