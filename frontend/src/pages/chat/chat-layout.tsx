import { HStack } from "@chakra-ui/react";
import { Outlet } from "react-router";
import ChatListSidebar from "./chat-sidebar";

export default function ChatLayout() {
  return (
    <HStack minH={"100vh"} maxH={"100vh"} alignItems={"start"}>
      <ChatListSidebar />
      <Outlet />
    </HStack>
  );
}
