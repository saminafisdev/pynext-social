import { ImagePlus, SendHorizonal } from "lucide-react";
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/api/apiClient";
import { Box, ButtonGroup, IconButton, Textarea } from "@chakra-ui/react";

export default function CommentComposerCard({
  post_id,
}: {
  post_id: string | undefined;
}) {
  const queryClient = useQueryClient();

  const [commentContent, setCommentContent] = useState("");

  const { mutate, isPending } = useMutation({
    mutationFn: () => {
      return api.post(`posts/${post_id}/comments/`, {
        content: commentContent,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments"] });
      queryClient.invalidateQueries({ queryKey: ["post", String(post_id)] });
      setCommentContent("");
    },
  });

  return (
    <Box bg={"bg.muted"}>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          mutate();
        }}
      >
        <Textarea
          bgColor={"bg.muted"}
          placeholder="Reply to this post"
          resize={"none"}
          autoresize
          maxH={"10lh"}
          outline={"none"}
          border={"none"}
          size={"lg"}
          value={commentContent}
          onChange={(e) => setCommentContent(e.target.value)}
        />
        <ButtonGroup size={"sm"} width="full" px={2}>
          <IconButton variant={"subtle"}>
            <ImagePlus />
          </IconButton>
          <IconButton
            variant={"subtle"}
            ml={"auto"}
            loading={isPending}
            color={"blue.500"}
            type="submit"
          >
            <SendHorizonal />
          </IconButton>
        </ButtonGroup>
      </form>
    </Box>
  );
}
