import {
  HStack,
  IconButton,
  Popover,
  Portal,
  Stack,
  Text,
  Textarea,
} from "@chakra-ui/react";
import { EmojiPickerComponent } from "./components/emoji-picker";
import { SendHorizonal, Smile } from "lucide-react";
import { useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { useMutation } from "@tanstack/react-query";
import api from "@/api/apiClient";

export default function NewChatPage() {
  const [message, setMessage] = useState("");
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const profileId = searchParams.get("profileId");

  const { mutate: sendMessage, isPending } = useMutation({
    mutationFn: async (content: string) => {
      const response = await api.post("chats/new/", {
        content,
        profile_id: profileId,
      });
      return response.data;
    },
    onSuccess: (data) => {
      const { chat_id } = data;
      navigate(`/chats/${chat_id}`);
    },
    onError: (error) => {
      console.error("Failed to send message:", error);
      // TODO: Add proper error handling/toast notification
    },
  });

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleSendMessage = () => {
    if (!message.trim() || isPending || !profileId) return;
    sendMessage(message.trim());
  };

  return (
    <Stack>
      <Text>New Message</Text>
      {!profileId && (
        <Text color="red.500" fontSize="sm">
          No profile selected. Please select a user to start a chat.
        </Text>
      )}
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
          onClick={handleSendMessage}
          disabled={!message.trim() || isPending || !profileId}
          loading={isPending}
          variant={"ghost"}
        >
          <SendHorizonal />
        </IconButton>
      </HStack>
    </Stack>
  );
}
