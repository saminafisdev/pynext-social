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
import { DialogTrigger } from "@radix-ui/react-dialog";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/api/apiClient";
import { Loader2 } from "lucide-react";

export function PostCreateDialog() {
  const queryClient = useQueryClient();
  const [postContent, setPostContent] = useState("");
  const [isPostDialogOpen, setIsPostDialogOpen] = useState(false);

  const { mutate, isPending } = useMutation({
    mutationFn: () => {
      return api.post("posts/", { content: postContent });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      setIsPostDialogOpen(false);
      setPostContent("");
    },
  });

  return (
    <Dialog open={isPostDialogOpen} onOpenChange={setIsPostDialogOpen}>
      <DialogTrigger className="w-full">
        <Input
          className="border-none shadow-none w-full placeholder:text-xl focus-visible:ring-0"
          placeholder="Post on Gull"
        />
      </DialogTrigger>
      <DialogContent className="sm:max-w-[650px]">
        <DialogHeader>
          <DialogTitle>Create a post</DialogTitle>
        </DialogHeader>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            mutate();
          }}
          className="space-y-4"
        >
          <div>
            <Textarea
              value={postContent}
              className="h-48 md:text-lg"
              onChange={(e) => setPostContent(e.target.value)}
            />
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Discard</Button>
            </DialogClose>
            <Button type="submit">
              {isPending && <Loader2 className="animate-spin" />}
              Post
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
