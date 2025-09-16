import { BrowserRouter, Route, Routes } from "react-router";
import RootLayout from "@/components/layout/layout.tsx";
import LoginPage from "./pages/login.tsx";
import ProfilePage from "./pages/profile.tsx";
import PostsHome from "@/pages/posts/index.tsx";
import PostDetail from "./pages/posts/post-detail.tsx";
import SignupPage from "./pages/signup.tsx";
import LoadingRoute from "./pages/startup-loading.tsx";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="login" element={<LoginPage />} />
        <Route path="signup" element={<SignupPage />} />
        <Route
          element={
            <LoadingRoute>
              <RootLayout />
            </LoadingRoute>
          }
        >
          <Route index element={<PostsHome />} />
          <Route path=":username/posts/:postId" element={<PostDetail />} />
          <Route path="profile" element={<ProfilePage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
