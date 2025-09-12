import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router";
import "./index.css";
import RootLayout from "@/components/layout/layout.tsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import LoginPage from "./pages/login.tsx";
import ProfilePage from "./pages/profile.tsx";
import PostsHome from "@/pages/posts/index.tsx";
import PostDetail from "./pages/posts/post-detail.tsx";

const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route element={<RootLayout />}>
            <Route index element={<PostsHome />} />
            <Route path=":username/posts/:id" element={<PostDetail />} />
            <Route path="profile" element={<ProfilePage />} />
          </Route>
          <Route path="login" element={<LoginPage />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  </StrictMode>
);
