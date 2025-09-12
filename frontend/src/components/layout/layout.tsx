import { Outlet } from "react-router";
import { SidebarProvider } from "../ui/sidebar";
import { AppSidebar } from "../app-sidebar";

export default function RootLayout() {
  return (
    <>
      <SidebarProvider>
        <AppSidebar />
        <main className="w-full">
          <Outlet />
        </main>
      </SidebarProvider>
    </>
  );
}
