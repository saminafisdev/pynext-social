import { Loader2, SendHorizonal } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent, CardFooter } from "./ui/card";
import { Textarea } from "./ui/textarea";
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/api/apiClient";

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
      setCommentContent("");
    },
  });

  return (
    <Card className="border-none shadow-none rounded-none">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          mutate();
        }}
      >
        <CardContent>
          <Textarea
            placeholder="Comment on this post"
            className="md:text-lg placeholder:text-xl py-8 rounded-none"
            value={commentContent}
            onChange={(e) => setCommentContent(e.target.value)}
          />
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant={"ghost"}>GIF</Button>
          <Button variant={"ghost"} disabled={isPending}>
            {isPending ? <Loader2 /> : <SendHorizonal />}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
