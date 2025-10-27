import type { Post } from "@/pages/posts/types/post";
import { timeAgo } from "@/lib/time";
import {
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
import { useRef, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/api/apiClient";
import { Avatar } from "@/components/ui/avatar";
import { useUser } from "@/hooks/use-user";

interface PostCommentDialogProps {
  post: Post;
  open: boolean;
  setOpen: (open: boolean) => void;
}

export default function PostCommentDialog({
  post,
  open,
  setOpen,
}: PostCommentDialogProps) {
  const [comment, setComment] = useState("");
  const { user } = post.author;
  const { data: authProfile } = useUser();

  const queryClient = useQueryClient();

  const ref = useRef<HTMLTextAreaElement | null>(null);

  const { mutate } = useMutation({
    mutationFn: async () => {
      const data = await api.post(`posts/${post.id}/comments/`, {
        content: comment,
      });
      return data;
    },
    onSuccess: () => {
      setComment("");
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      setOpen(false);
    },
  });

  return (
    <Dialog.Root
      scrollBehavior={"inside"}
      size={{ mdDown: "full", md: "lg" }}
      initialFocusEl={() => ref.current}
      open={open}
      onOpenChange={(details) => setOpen(details.open)}
    >
      <Dialog.Trigger asChild>
        <Button variant={"ghost"}>
          <MessageCircle />
          {post.comments_count}
        </Button>
      </Dialog.Trigger>
      <Dialog.Backdrop />
      <Dialog.Positioner>
        <Dialog.Content>
          <Dialog.CloseTrigger asChild>
            <CloseButton />
          </Dialog.CloseTrigger>
          <Dialog.Header>
            <Dialog.Title>Replying to</Dialog.Title>
          </Dialog.Header>
          <Dialog.Body>
            <Stack gap={16}>
              <HStack gap={4} alignItems={"start"}>
                <Avatar
                  src={post.author.profile_picture}
                  fallback={user.full_name}
                />
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
              <Avatar
                src={authProfile?.profile_picture}
                fallback={authProfile?.full_name}
              />
              <Stack
                flexGrow={1}
                gap={0}
                alignItems={"end"}
                bg={"bg.muted"}
                className="group"
                _focusWithin={{ border: "1px solid ActiveBorder" }}
              >
                <Textarea
                  placeholder="Write a quick response"
                  variant={"subtle"}
                  textStyle={"xl"}
                  autoresize
                  resize={"none"}
                  maxH={"10lh"}
                  border={"none"}
                  ring={"none"}
                  ref={ref}
                  outline={"none"}
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                />
                <ButtonGroup variant={"subtle"} size={"sm"}>
                  <IconButton>
                    <ImagePlus />
                  </IconButton>
                  <IconButton
                    disabled={!comment.trim()}
                    onClick={() => mutate()}
                  >
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
