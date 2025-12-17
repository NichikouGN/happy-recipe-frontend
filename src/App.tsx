import { Route, Routes, BrowserRouter } from "react-router-dom";
import { useAuthStore } from "./stores/authStore";
import { useUserStore } from "./stores/userStore";
import { useEffect } from "react";
import { ToastRenderer } from "./components/Toast/ToastRenderer";
import { useThemeStore } from "./stores/themeStore";
import Home from "./pages/Home/Home";
import Upload from "./pages/Upload/Upload";
import Notifications from "./pages/Notifications/Notifications";
import Profile from "./pages/Profile/Profile";
import NotFound from "./pages/NotFound/NotFound";
import Signin from "./pages/Signin/Signin";
import TwoFactorAuth from "./pages/TwoFactorAuth/TwoFactorAuth";
import Signup from "./pages/Signup/Signup";
import Discover from "./pages/Discover/Discover";
import Search from "./pages/Search/Search";
import Post from "./pages/Post/Post";
import Layout from "./components/Layout/Layout";
import EditProfile from "./pages/EditProfile/EditProfile";
import Settings from "./pages/Settings/Settings";

const App = () => {
  // Store subscription to fetch user info upon authorization
  const signInState = useAuthStore((state) => state.signInState);

  useEffect(() => {
    if (signInState === "authorized") {
      useUserStore.getState().fetchUserInfo();
    }
  }, [signInState]);

  // Validate access token on app load
  const validateAccessToken = useAuthStore((state) => state.validateAccessToken);

  useEffect(() => {
    validateAccessToken();
  }, []);

  // Apply theme to document root
  const theme = useThemeStore((state) => state.theme);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/post/:postId" element={<Post />} />
          <Route path="/signin/2fa" element={<TwoFactorAuth />} />
          <Route path="/signin" element={<Signin />} />
          <Route path="/signup" element={<Signup />} />

          <Route element={<Layout />}>
            <Route path="/" element={<Home />} />
            <Route path="/discover" element={<Discover />} />
            <Route path="/search" element={<Search />} />

            <Route path="/upload" element={<Upload />} />
            <Route path="/notices" element={<Notifications />} />

            <Route path="/profile" element={<Profile />} />
            <Route path="/settings" element={<Settings />} />

            <Route path="/profile/edit" element={<EditProfile />} />
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>

      <ToastRenderer />
    </>
  );
};

export default App;
