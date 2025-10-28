import api from "@/api/apiClient";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { Post } from "@/pages/posts/types/post";
import {
  Button,
  CloseButton,
  Dialog,
  IconButton,
  Menu,
  Portal,
  Textarea,
} from "@chakra-ui/react";
import { Ellipsis } from "lucide-react";
import { useNavigate } from "react-router";
import { useEffect, useState } from "react";

export function PostMenu({ post }: { post: Post }) {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { mutate: deletePostMutataion } = useMutation({
    mutationFn: handleDeletePost,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      navigate("/", { replace: true });
    },
  });

  async function handleDeletePost() {
    const { data } = await api.delete(`posts/${post.id}/`);
    console.log(data);
  }

  // infer a text field for the post (common names)
  type PostText = Post &
    Partial<{ content: string; body: string; text: string }>;
  const _post = post as PostText;
  const initialText = _post.content ?? _post.body ?? _post.text ?? "";
  const [editOpen, setEditOpen] = useState(false);
  const [editedText, setEditedText] = useState(initialText);

  useEffect(() => {
    if (editOpen) {
      setEditedText(initialText);
    }
  }, [editOpen, initialText]);

  const updateMutation = useMutation({
    mutationFn: async (payload: { content: string }) => {
      const { data } = await api.put(`posts/${post.id}/`, payload);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      queryClient.invalidateQueries({ queryKey: ["post", String(post.id)] });
      setEditOpen(false);
    },
  });

  const noChanges = editedText.trim() === (initialText ?? "").trim();

  return (
    <Menu.Root closeOnSelect={false}>
      <Menu.Trigger asChild>
        <IconButton size={"sm"} variant={"ghost"}>
          <Ellipsis />
        </IconButton>
      </Menu.Trigger>
      <Menu.Positioner>
        <Menu.Content>
          <Menu.Item value="edit">
            <Dialog.Root
              open={editOpen}
              onOpenChange={(e: boolean | { open?: boolean }) =>
                setEditOpen(typeof e === "boolean" ? e : Boolean(e.open))
              }
              role="dialog"
            >
              <Dialog.Trigger w="full" textAlign={"left"}>
                Edit post
              </Dialog.Trigger>

              <Portal>
                <Dialog.Backdrop />
                <Dialog.Positioner>
                  <Dialog.Content>
                    <Dialog.Header>
                      <Dialog.Title>Edit post</Dialog.Title>
                    </Dialog.Header>
                    <Dialog.Body>
                      <Textarea
                        value={editedText}
                        onChange={(e) => setEditedText(e.target.value)}
                        minH="120px"
                      />
                    </Dialog.Body>
                    <Dialog.Footer>
                      <Dialog.ActionTrigger asChild>
                        <Button variant="outline">Cancel</Button>
                      </Dialog.ActionTrigger>
                      <Button
                        colorPalette="blue"
                        onClick={() =>
                          updateMutation.mutate({ content: editedText })
                        }
                        disabled={noChanges || updateMutation.isPending}
                        loading={updateMutation.isPending}
                      >
                        Update
                      </Button>
                    </Dialog.Footer>
                    <Dialog.CloseTrigger asChild>
                      <CloseButton size="sm" />
                    </Dialog.CloseTrigger>
                  </Dialog.Content>
                </Dialog.Positioner>
              </Portal>
            </Dialog.Root>
          </Menu.Item>
          <Menu.Item
            value="delete"
            color="fg.error"
            _hover={{ bg: "bg.error", color: "fg.error" }}
          >
            <Dialog.Root role="alertdialog">
              <Dialog.Trigger w="full" textAlign={"left"}>
                Delete post
              </Dialog.Trigger>
              <Portal>
                <Dialog.Backdrop />
                <Dialog.Positioner>
                  <Dialog.Content>
                    <Dialog.Header>
                      <Dialog.Title>Are you sure?</Dialog.Title>
                    </Dialog.Header>
                    <Dialog.Body>
                      <p>This action cannot be undone.</p>
                    </Dialog.Body>
                    <Dialog.Footer>
                      <Dialog.ActionTrigger asChild>
                        <Button variant="outline">Cancel</Button>
                      </Dialog.ActionTrigger>
                      <Button
                        colorPalette="red"
                        onClick={() => deletePostMutataion()}
                      >
                        Delete
                      </Button>
                    </Dialog.Footer>
                    <Dialog.CloseTrigger asChild>
                      <CloseButton size="sm" />
                    </Dialog.CloseTrigger>
                  </Dialog.Content>
                </Dialog.Positioner>
              </Portal>
            </Dialog.Root>
          </Menu.Item>
        </Menu.Content>
      </Menu.Positioner>
    </Menu.Root>
  );
}
