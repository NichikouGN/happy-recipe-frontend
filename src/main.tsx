import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { ThemeProvider } from "./context/ThemeContext.tsx";
import { AuthProvider } from "./context/AuthContext.tsx";
import { UserProvider } from "./context/userContext.tsx";
import { DiscoveryProvider } from "./context/DiscoveryContext.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AuthProvider>
      <UserProvider>
        <ThemeProvider>
          <DiscoveryProvider>
            <App></App>
          </DiscoveryProvider>
        </ThemeProvider>
      </UserProvider>
    </AuthProvider>
  </StrictMode>
);
