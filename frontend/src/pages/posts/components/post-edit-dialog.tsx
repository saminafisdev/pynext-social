import api from "@/api/apiClient";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import type { Post } from "@/pages/posts/types/post";

export function PostEditDialog({
  post,
  isEditOpen,
  setIsEditOpen,
}: {
  post: Post;
  isEditOpen: boolean;
  setIsEditOpen: (open: boolean) => void;
}) {
  const queryClient = useQueryClient();
  const [postContent, setPostContent] = useState(post.content);

  const { mutate: editPostMutate, isPending } = useMutation({
    mutationFn: async ({ id, content }: { id: number; content: string }) => {
      const { data } = await api.put(`posts/${id}/`, { content });
      return data;
    },
    onSuccess: () => {
      setIsEditOpen(false);
      queryClient.invalidateQueries({ queryKey: ["post", String(post.id)] });
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });

  return (
    <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
      <DialogContent className="sm:max-w-[650px]">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            editPostMutate({ id: post.id, content: postContent });
          }}
          className="space-y-4"
        >
          <DialogHeader>
            <DialogTitle>Edit post</DialogTitle>
          </DialogHeader>
          <div>
            <Textarea
              value={postContent}
              className="h-48 md:text-lg"
              onChange={(e) => setPostContent(e.target.value)}
            />
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button type="submit" disabled={isPending}>
              {isPending && <Loader2 className="animate-spin" />}
              Save changes
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
