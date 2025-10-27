import { Box, Flex } from "@chakra-ui/react";
import { Outlet, useLocation } from "react-router";
import ChatListSidebar from "./chat-sidebar";

export default function ChatLayout() {
  const location = useLocation();
  // const { chatId } = useParams();
  // const isChatDetail = Boolean(chatId);
  const isChatList = location.pathname === "/chats";
  return (
    <Flex direction={{ base: "column", md: "row" }} height="100vh">
      <Box
        display={{ base: isChatList ? "block" : "none", md: "block" }}
        width={{ base: "100%", md: "300px" }}
      >
        <ChatListSidebar />
      </Box>

      {/* Chat Messages */}
      <Box
        display={{ base: !isChatList ? "block" : "none", md: "block" }}
        flex="1"
      >
        <Outlet />
      </Box>
    </Flex>
  );
}
