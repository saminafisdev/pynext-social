import {
  Avatar,
  Box,
  Button,
  EmptyState,
  HStack,
  Input,
  InputGroup,
  LinkBox,
  LinkOverlay,
  ScrollArea,
  Stack,
  VStack,
} from "@chakra-ui/react";
import { NewMessageDialogTrigger } from "./components/new-message-dialog";
import { Inbox, Search, SquarePen } from "lucide-react";
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

  const emptyChat = (
    <EmptyState.Root>
      <EmptyState.Content>
        <EmptyState.Indicator>
          <Inbox />
        </EmptyState.Indicator>
        <VStack textAlign="center">
          <EmptyState.Title>Your inbox is empty</EmptyState.Title>
          <EmptyState.Description>
            Send private messages to a friend to start chatting.
          </EmptyState.Description>
        </VStack>
        <NewMessageDialogTrigger>
          <Button>Send a new message</Button>
        </NewMessageDialogTrigger>
      </EmptyState.Content>
    </EmptyState.Root>
  );

  return (
    <Box py={6} borderRightWidth={"1px"} px={4}>
      <HStack gap={2}>
        <InputGroup startElement={<Search />}>
          <Input
            placeholder="Search"
            variant={"subtle"}
            borderRadius={"full"}
          />
        </InputGroup>
        <NewMessageDialogTrigger>
          <Button
            variant="solid"
            size="sm"
            p={2}
            colorPalette={"primary"}
            borderRadius="full"
            cursor="pointer"
          >
            <SquarePen size={16} />
          </Button>
        </NewMessageDialogTrigger>
      </HStack>
      <ScrollArea.Root mt={6}>
        <ScrollArea.Viewport>
          <ScrollArea.Content>
            {chats.length === 0
              ? emptyChat
              : chats.map((chat) => (
                  <LinkBox key={chat.id} _hover={{ bg: "bg.muted" }}>
                    <HStack p={4}>
                      <Avatar.Root>
                        <Avatar.Fallback
                          name={chat?.other_user.user.full_name}
                        />
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
