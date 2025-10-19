import { useUser } from "@/hooks/use-user";
import {
  Box,
  Flex,
  HStack,
  IconButton,
  Popover,
  Portal,
  ScrollArea,
  Text,
  Textarea,
} from "@chakra-ui/react";
import { SendHorizonal, Smile } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import useWebSocket, { ReadyState } from "react-use-websocket";
import { useStickToBottom } from "use-stick-to-bottom";
import type { ChatDetail, ChatMessage } from "./types/chat";
import { useParams } from "react-router";
import { EmojiPickerComponent } from "./components/emoji-picler";

export default function ChatDetailPage() {
  const { data: profile } = useUser();
  const [chatDetail, setChatDetail] = useState<ChatDetail | null>(null);
  const [chatList, setChatList] = useState<ChatMessage[]>([]);
  const [message, setMessage] = useState("");
  const inputRef = useRef<HTMLTextAreaElement>(null);
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
        setChatList((prev) => [...prev, data.message]);
      }
    }
  }, [lastMessage]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter") {
      if (e.shiftKey) {
        return;
      } else {
        e.preventDefault();
        sendMessage();
      }
    }
  };

  function sendMessage() {
    if (!message.trim()) return;
    if (readyState === ReadyState.OPEN) {
      sendJsonMessage({
        message: message.trim(),
      });
      setMessage("");
    }
  }

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
        <ScrollArea.Viewport ref={sticky.scrollRef}>
          <ScrollArea.Content
            height={"full"}
            paddingEnd={"5"}
            ref={sticky.contentRef}
          >
            <Flex direction={"column"} py={2} gap={2}>
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

      <HStack height={"max-content"} alignItems={"end"} py={3}>
        <Textarea
          size={"lg"}
          autoresize
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Message..."
          ref={inputRef}
        />
        <Popover.Root>
          <Popover.Trigger asChild>
            <IconButton variant={"ghost"}>
              <Smile />
            </IconButton>
          </Popover.Trigger>
          <Portal>
            <Popover.Positioner>
              <Popover.Content>
                <Popover.Arrow />
                <Popover.Body asChild>
                  <EmojiPickerComponent
                    inputMessage={message}
                    setMessageInput={setMessage}
                    inputRef={inputRef}
                  />
                </Popover.Body>
              </Popover.Content>
            </Popover.Positioner>
          </Portal>
        </Popover.Root>
        <IconButton
          aria-label="Send message"
          onClick={sendMessage}
          disabled={!message.trim()}
          variant={"ghost"}
        >
          <SendHorizonal />
        </IconButton>
      </HStack>
    </Flex>
  );
}
