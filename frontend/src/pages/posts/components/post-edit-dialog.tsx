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
import type { Post } from "@/features/posts/types/post";

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
    mutationFn: handleEditPost,
    onSuccess: () => {
      setIsEditOpen(false);
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });

  async function handleEditPost() {
    const { data } = await api.put(`/posts/${post.id}/`, {
      content: postContent,
    });
    return data;
  }
  return (
    <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
      <form
        id="editPostForm"
        onSubmit={(e) => {
          e.preventDefault();
          editPostMutate();
        }}
      >
        <DialogContent className="sm:max-w-[650px]">
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
            <Button type="submit" form="editPostForm" disabled={isPending}>
              {isPending && <Loader2 className="animate-spin" />}
              Save changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  );
}
