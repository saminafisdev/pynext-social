import { BrowserRouter, Route, Routes } from "react-router";
import RootLayout from "@/components/layout/layout.tsx";
import LoginPage from "@/pages/login.tsx";
import ProfilePage from "./pages/profile/profile.tsx";
import PostsHome from "@/pages/posts/index.tsx";
import PostDetail from "./pages/posts/post-detail.tsx";
import SignupPage from "./pages/signup.tsx";
import LoadingRoute from "./pages/startup-loading.tsx";
import ChatDetailPage from "./pages/chat/page.tsx";
import ChatIndex from "./pages/chat/chat-index.tsx";
import ChatLayout from "./pages/chat/chat-layout.tsx";
import NewChatPage from "./pages/chat/new-chat.tsx";

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
          <Route path="/u/:username" element={<ProfilePage />} />
          <Route path="chats" element={<ChatLayout />}>
            <Route index element={<ChatIndex />} />
            <Route path="/chats/:chatId" element={<ChatDetailPage />} />
            <Route path="/chats/new" element={<NewChatPage />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
