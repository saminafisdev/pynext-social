import {
  Avatar,
  Box,
  HStack,
  Input,
  InputGroup,
  LinkBox,
  LinkOverlay,
  ScrollArea,
  Stack,
  Text,
} from "@chakra-ui/react";
import { Search } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router";
import useWebSocket from "react-use-websocket";

interface ChatItemInterface {
  id: number;
  other_user: {
    profile_picture: string;
    user: {
      full_name: string;
    };
  };
}

export default function ChatListSidebar() {
  const [chats, setChats] = useState<ChatItemInterface[]>([]);

  const { lastMessage } = useWebSocket("ws://localhost:8000/ws/chats/", {
    onOpen: () => console.log("opened"),
    shouldReconnect: () => true,
  });

  useEffect(() => {
    if (lastMessage !== null) {
      const data = JSON.parse(lastMessage.data);
      setChats(data.chats);
    }
  }, [lastMessage]);

  console.log(chats);

  return (
    <Box py={6} borderRightWidth={"1px"}>
      <InputGroup startElement={<Search />}>
        <Input placeholder="Search" variant={"subtle"} borderRadius={"full"} />
      </InputGroup>
      <ScrollArea.Root mt={6}>
        <ScrollArea.Viewport>
          <ScrollArea.Content>
            {chats.map((chat) => (
              <LinkBox key={chat.id} _hover={{ bg: "bg.muted" }}>
                <HStack p={4}>
                  <Avatar.Root>
                    <Avatar.Fallback name={chat?.other_user.user.full_name} />
                    <Avatar.Image src={chat?.other_user.profile_picture} />
                  </Avatar.Root>
                  <Stack>
                    <LinkOverlay asChild>
                      <Link to={`/chats/${chat.id}`}>
                        {chat.other_user.user.full_name}
                      </Link>
                    </LinkOverlay>
                  </Stack>
                </HStack>
              </LinkBox>
            ))}
          </ScrollArea.Content>
        </ScrollArea.Viewport>
        <ScrollArea.Scrollbar>
          <ScrollArea.Thumb />
        </ScrollArea.Scrollbar>
        <ScrollArea.Corner />
      </ScrollArea.Root>
    </Box>
  );
}
