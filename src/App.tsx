import { Route, Routes, BrowserRouter } from "react-router-dom";
import Home from "./pages/Home/Home";
import Upload from "./pages/Upload/Upload";
import Notifications from "./pages/Notifications/Notifications";
import Profile from "./pages/Profile/Profile";
import NotFound from "./pages/NotFound/NotFound";
import Signin from "./pages/Signin/Signin";
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute";
import TwoFactorAuth from "./pages/TwoFactorAuth/TwoFactorAuth";
import Signup from "./pages/Signup/Signup";
import Discover from "./pages/Discover/Discover";
import Search from "./pages/Search/Search";
import Post from "./pages/Post/Post";
import Layout from "./components/Layout/Layout";

const App = () => {
  //const { themeColor, updateTheme } = useThemeContext();
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/post/:postID" element={<Post />} />
        <Route path="/login" element={<Signin />} />
        <Route path="/sign-up" element={<Signup />} />
        <Route
          path="/authentication"
          element={
            <TwoFactorAuth />
            // <ProtectedRoute requireAuthoriazation="2FA">
            //   <TwoFactorAuth />
            // </ProtectedRoute>
          }
        />

        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/discover" element={<Discover />} />
          <Route path="/search" element={<Search />} />

          <Route path="/upload" element={<Upload />} />
          <Route path="/notices" element={<Notifications />} />

          <Route
            path="/profile"
            element={
              <ProtectedRoute requireAuthoriazation="authorized">
                <Profile />
              </ProtectedRoute>
            }
          />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
