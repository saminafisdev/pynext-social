import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router";
import "./index.css";
import RootLayout from "./components/layout/RootLayout.tsx";
import LoginPage from "./pages/Login.tsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import ProfilePage from "./pages/Profile.tsx";
import PostsHome from "./features/posts/index.tsx";

const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route element={<RootLayout />}>
            <Route index element={<PostsHome />} />
            <Route path="login" element={<LoginPage />} />
            <Route path="profile" element={<ProfilePage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  </StrictMode>
);
