import { useUser } from "@/hooks/use-user";
import { Box, Button, Flex, Input, ScrollArea } from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";
import useWebSocket, { ReadyState } from "react-use-websocket";

const socketUrl = "ws://localhost:8000/ws/chats/1/";

export default function ChatPage() {
  const { data: profile } = useUser();
  const [chatList, setChatList] = useState([]);
  const [message, setMessage] = useState("");
  const socket = useRef<null | WebSocket>(null);
  const {
    sendJsonMessage,
    lastMessage,
    lastJsonMessage,
    readyState,
    getWebSocket,
  } = useWebSocket(socketUrl, {
    onOpen: () => console.log("opened"),
    shouldReconnect: () => true,
  });

  useEffect(() => {
    socket.current = new WebSocket(socketUrl);
    socket.current.onopen = () => console.log("Connected to ws established");
    socket.current.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === "initial_messages") {
        setChatList(data.messages);
      } else if (data.type === "new_message") {
        setChatList((prev) => [...prev, data.message]);
      }
    };
  }, []);

  function sendMessage() {
    // if (socket.current?.OPEN) {
    //   socket.current.send(JSON.stringify({ message: message }));
    //   setMessage("");
    // }
    if (readyState === ReadyState.OPEN) {
      sendJsonMessage({
        message: message,
      });
    }
  }

  console.log(lastMessage);

  if (socket.current?.CONNECTING) return <p>Connecting..</p>;

  if (socket.current?.OPEN) {
    return (
      <Flex direction={"column"} height={"svh"}>
        <header>
          <h3>Messages</h3>
          <input type="search" />
        </header>
        <Flex direction={"column"} flexGrow={1}>
          {chatList.map((chat) => (
            <Box
              key={chat.id}
              bgColor={"blue.500"}
              p={1}
              ml={profile.id === chat.sender ? "auto" : 0}
              mr={profile.id !== chat.sender ? "auto" : 0}
            >
              {chat?.content}
            </Box>
          ))}
        </Flex>
        <Box>
          <Input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Message..."
          />
          <Button onClick={sendMessage}>Send</Button>
        </Box>
      </Flex>
    );
  }
}
