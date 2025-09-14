import type { Post } from "@/pages/posts/types/post";
import { timeAgo } from "@/lib/time";
import {
  Avatar,
  Box,
  Button,
  ButtonGroup,
  CloseButton,
  Dialog,
  HStack,
  IconButton,
  Stack,
  Text,
  Textarea,
} from "@chakra-ui/react";
import { ImagePlus, MessageCircle, SendHorizonal } from "lucide-react";

interface PostCommentDialogProps {
  post: Post;
}

export default function PostCommentDialog({ post }: PostCommentDialogProps) {
  const { user } = post.author;
  return (
    <Dialog.Root scrollBehavior={"inside"} size={"lg"}>
      <Dialog.Trigger asChild>
        <Button variant={"ghost"}>
          <MessageCircle />
          {post.comments_count}
        </Button>
      </Dialog.Trigger>
      <Dialog.Backdrop />
      <Dialog.Positioner>
        <Dialog.Content>
          <Dialog.CloseTrigger>
            <CloseButton />
          </Dialog.CloseTrigger>
          <Dialog.Header>
            <Dialog.Title>Replying to</Dialog.Title>
          </Dialog.Header>
          <Dialog.Body>
            <Stack gap={16}>
              <HStack gap={4} alignItems={"start"}>
                <Avatar.Root>
                  <Avatar.Image src="https://images.unsplash.com/photo-1511806754518-53bada35f930" />
                  <Avatar.Fallback name={user.full_name} />
                </Avatar.Root>
                <Stack>
                  <Box>
                    <Text textStyle={"md"}>{user.full_name}</Text>
                    <Text textStyle={"sm"} color={"fg.subtle"}>
                      @{user.username} &bull; {timeAgo(post.created_at)}
                    </Text>
                  </Box>
                  <Text
                    textStyle={"xl"}
                    wordBreak={"break-word"}
                    whiteSpace={"pre-wrap"}
                  >
                    {post.content}
                  </Text>
                </Stack>
              </HStack>
            </Stack>
          </Dialog.Body>
          <Dialog.Footer justifyContent={"start"} alignItems={"end"}>
            <HStack gap={4} alignItems={"start"} flexGrow={1}>
              <Avatar.Root>
                <Avatar.Image src="https://images.unsplash.com/photo-1511806754518-53bada35f930" />
                <Avatar.Fallback name={user.full_name} />
              </Avatar.Root>
              <Stack
                flexGrow={1}
                gap={0}
                alignItems={"end"}
                bg={"bg.muted"}
                className="group"
                _focusWithin={{ border: "1px solid ActiveBorder" }}
              >
                <Textarea
                  placeholder="Write your response"
                  variant={"subtle"}
                  textStyle={"xl"}
                  autoresize
                  resize={"none"}
                  maxH={"10lh"}
                  border={"none"}
                  ring={"none"}
                  outline={"none"}
                />
                <ButtonGroup variant={"subtle"} size={"sm"}>
                  <IconButton>
                    <ImagePlus />
                  </IconButton>
                  <IconButton>
                    <SendHorizonal />
                  </IconButton>
                </ButtonGroup>
              </Stack>
            </HStack>
          </Dialog.Footer>
        </Dialog.Content>
      </Dialog.Positioner>
    </Dialog.Root>
  );
}
