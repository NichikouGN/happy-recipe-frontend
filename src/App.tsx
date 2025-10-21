import { Route, Routes, BrowserRouter } from "react-router-dom";
import { Layout } from "./layout/Layout";
import Home from "./pages/Home/Home";
import Search from "./pages/Search/Search";
import Upload from "./pages/Upload/Upload";
import Notifications from "./pages/Notifications/Notifications";
import Profile from "./pages/Profile/Profile";
import NotFound from "./pages/NotFound/NotFound";
import Login from "./pages/Login/Login";
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute";

const App = () => {
  //const { themeColor, updateTheme } = useThemeContext();
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/search" element={<Search />} />
          <Route path="/upload" element={<Upload />} />
          <Route path="/notices" element={<Notifications />} />

          <Route
            path="/profile"
            element={
              <ProtectedRoute>
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
