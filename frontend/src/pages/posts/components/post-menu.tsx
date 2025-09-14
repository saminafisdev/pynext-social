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
} from "@chakra-ui/react";
import { Ellipsis } from "lucide-react";
import { useNavigate } from "react-router";

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

  return (
    <Menu.Root closeOnSelect={false}>
      <Menu.Trigger asChild>
        <IconButton size={"sm"} variant={"ghost"}>
          <Ellipsis />
        </IconButton>
      </Menu.Trigger>
      <Menu.Positioner>
        <Menu.Content>
          <Menu.Item value="edit">Edit post</Menu.Item>
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
