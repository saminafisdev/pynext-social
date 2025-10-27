import {
  HStack,
  IconButton,
  Popover,
  Portal,
  Textarea,
} from "@chakra-ui/react";
import { SendHorizonal, Smile } from "lucide-react";
import { memo, useRef, useState } from "react";
import { ReadyState } from "react-use-websocket";
import { EmojiPickerComponent } from "./emoji-picker";

type ChatInputFormProps = {
  sendJsonMessage: (jsonMessage: { message: string }) => void;
  readyState: ReadyState;
};

const ChatInputForm = memo(
  ({ sendJsonMessage, readyState }: ChatInputFormProps) => {
    const [message, setMessage] = useState("");
    const inputRef = useRef<HTMLTextAreaElement>(null);

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
    );
  }
);

export default ChatInputForm;
