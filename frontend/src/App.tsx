import { BrowserRouter, Route, Routes } from "react-router";
import RootLayout from "@/components/layout/layout.tsx";
import LoginPage from "./pages/login.tsx";
import ProfilePage from "./pages/profile.tsx";
import PostsHome from "@/pages/posts/index.tsx";
import PostDetail from "./pages/posts/post-detail.tsx";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<RootLayout />}>
          <Route index element={<PostsHome />} />
          <Route path=":username/posts/:postId" element={<PostDetail />} />
          <Route path="profile" element={<ProfilePage />} />
        </Route>
        <Route path="login" element={<LoginPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
