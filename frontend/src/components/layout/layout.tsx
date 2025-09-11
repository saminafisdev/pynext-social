import { Outlet } from "react-router";
import { SidebarProvider } from "../ui/sidebar";
import { AppSidebar } from "../app-sidebar";

export default function RootLayout() {
  return (
    <>
      <SidebarProvider>
        <div className="flex h-screen">
          <AppSidebar />
          <Outlet />
        </div>
      </SidebarProvider>
    </>
  );
}
