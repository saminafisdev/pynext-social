import { Center, Text, VStack } from "@chakra-ui/react";
import { MessageCircleMoreIcon } from "lucide-react";

export default function ChatIndex() {
  return (
    <Center flexGrow={1} height={"100vh"}>
      <VStack>
        <MessageCircleMoreIcon size={"64"} />
        <Text fontSize={"2xl"}>Select a chat to start conversation</Text>
      </VStack>
    </Center>
  );
}
