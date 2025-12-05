import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { AuthProvider } from "./context/AuthContext.tsx";
import { UserProvider } from "./context/userContext.tsx";
import { PostProvider } from "./context/PostContext.tsx";
import { ToastContextProvider } from "./context/ToastContext.tsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SearchProvider } from "./context/SearchContext.tsx";

const queryClient = new QueryClient();
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <ToastContextProvider>
        <AuthProvider>
          <UserProvider>
            <PostProvider>
              <SearchProvider>
                <App></App>
              </SearchProvider>
            </PostProvider>
          </UserProvider>
        </AuthProvider>
      </ToastContextProvider>
    </QueryClientProvider>
  </StrictMode>
);
