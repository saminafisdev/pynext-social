import { useUser } from "@/hooks/use-user";
import { Box, Flex, ScrollArea, Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import useWebSocket from "react-use-websocket";
import { useStickToBottom } from "use-stick-to-bottom";
import type { ChatDetail, ChatMessage } from "./types/chat";
import { useParams } from "react-router";
import ChatInputForm from "./components/chat-input-form";

export default function ChatDetailPage() {
  const { data: profile } = useUser();
  const [chatDetail, setChatDetail] = useState<ChatDetail | null>(null);
  const [chatList, setChatList] = useState<ChatMessage[]>([]);
  const sticky = useStickToBottom();

  const { chatId } = useParams();
  const socketUrl = `ws://localhost:8000/ws/chats/${chatId}/`;

  const { sendJsonMessage, lastMessage, readyState } = useWebSocket(socketUrl, {
    onOpen: () => console.log("opened"),
    shouldReconnect: () => true,
  });

  useEffect(() => {
    if (lastMessage !== null) {
      const data = JSON.parse(lastMessage.data);
      if (data.type === "initial_messages") {
        setChatList(data.messages);
        setChatDetail(data?.chat);
      } else if (data.type === "new_message") {
        setChatList((prev) => [data.message, ...prev]);
      }
    }
  }, [lastMessage]);

  return (
    <Flex direction={"column"} minH={"100vh"} maxH={"100vh"} flexGrow={1}>
      <Box
        as={"header"}
        height={"max-content"}
        py={4}
        borderBottomWidth={"1px"}
      >
        <Text fontSize={"xl"}>{chatDetail?.other_user}</Text>
      </Box>
      <ScrollArea.Root variant={"hover"} flexGrow={1} size={"xs"}>
        <ScrollArea.Viewport ref={sticky.scrollRef} flexGrow={1}>
          <ScrollArea.Content paddingEnd={"5"} ref={sticky.contentRef}>
            <Flex
              direction={"column-reverse"}
              py={2}
              gap={1}
              justifyContent={"flex-end"}
              flexGrow={1}
            >
              {chatList.map((chat) => (
                <Box
                  key={chat.id}
                  bgColor={
                    profile.id === chat.sender.profile.id
                      ? "blue.solid"
                      : { base: "gray.200", _dark: "gray.900" }
                  }
                  p={2}
                  borderRadius="lg"
                  ml={profile.id === chat.sender.profile.id ? "auto" : 0}
                  mr={profile.id !== chat.sender.profile.id ? "auto" : 0}
                  width={"max-content"}
                  maxWidth={"80"}
                >
                  <Text
                    color={
                      profile.id === chat.sender.profile.id
                        ? "white"
                        : { base: "black", _dark: "white" }
                    }
                    whiteSpace={"pre-wrap"}
                  >
                    {chat?.content}
                  </Text>
                </Box>
              ))}
            </Flex>
          </ScrollArea.Content>
        </ScrollArea.Viewport>
        <ScrollArea.Scrollbar>
          <ScrollArea.Thumb />
        </ScrollArea.Scrollbar>
        <ScrollArea.Corner />
      </ScrollArea.Root>

      <ChatInputForm
        sendJsonMessage={sendJsonMessage}
        readyState={readyState}
      />
    </Flex>
  );
}
