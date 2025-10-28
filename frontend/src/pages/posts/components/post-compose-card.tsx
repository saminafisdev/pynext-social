import api from "@/api/apiClient";
import { Avatar } from "@/components/ui/avatar";
import { useUser } from "@/hooks/use-user";
import {
  Button,
  Card,
  CloseButton,
  Dialog,
  HStack,
  Input,
  SkeletonCircle,
  Stack,
  Text,
  Textarea,
} from "@chakra-ui/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRef, useState } from "react";

export default function PostCompose() {
  const queryClient = useQueryClient();
  const ref = useRef<HTMLTextAreaElement | null>(null);
  const { data: profile, isLoading } = useUser();

  const [postConent, setPostContent] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const { mutate, isPending, isError } = useMutation({
    mutationFn: () => {
      return api.post("posts/", { content: postConent });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      setPostContent("");
      setIsDialogOpen(false);
    },
  });

  if (isError) return <Text>There was an error</Text>;
  if (isLoading)
    return (
      <Card.Root>
        <Card.Body>
          <HStack>
            <SkeletonCircle size={10} />
            <Input
              variant={"flushed"}
              placeholder="Create a post"
              textStyle={"2xl"}
              pb={2}
              readOnly
            />
          </HStack>
        </Card.Body>
      </Card.Root>
    );

  return (
    <Card.Root borderRadius={"none"}>
      <Card.Body>
        <HStack>
          <Avatar
            src={profile.profile_picture}
            fallback={profile.user.full_name}
          />
          <Dialog.Root
            size={{ mdDown: "full", md: "lg" }}
            open={isDialogOpen}
            onOpenChange={(e) => setIsDialogOpen(e.open)}
            initialFocusEl={() => ref.current}
          >
            <Dialog.Trigger flexGrow={1} ml={2}>
              <Input
                variant={"outline"}
                placeholder="Create a post"
                textStyle={"xl"}
                py={6}
                borderRadius={"full"}
                readOnly
              />
            </Dialog.Trigger>
            <Dialog.Backdrop />
            <Dialog.Positioner>
              <Dialog.Content>
                <Dialog.CloseTrigger asChild>
                  <CloseButton />
                </Dialog.CloseTrigger>
                <Dialog.Header>
                  <HStack>
                    <Avatar
                      src={profile.profile_picture}
                      fallback={profile.user.full_name}
                    />
                    <Stack gap={0}>
                      <Dialog.Title>{profile.user.full_name}</Dialog.Title>
                      <Dialog.Description>
                        @{profile.user.username}
                      </Dialog.Description>
                    </Stack>
                  </HStack>
                </Dialog.Header>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    mutate();
                  }}
                >
                  <Dialog.Body>
                    <Textarea
                      autoresize
                      maxH={"20lh"}
                      placeholder={`What's on your mind, ${profile.user.first_name}?`}
                      resize={"none"}
                      size={"xl"}
                      textStyle={"lg"}
                      variant={"subtle"}
                      ref={ref}
                      value={postConent}
                      onChange={(e) => setPostContent(e.target.value)}
                    />
                  </Dialog.Body>
                  <Dialog.Footer>
                    {/* <IconButton variant={"ghost"} mr={"auto"}>
                      <ImagePlus />
                    </IconButton> */}
                    <Button
                      type="submit"
                      loading={isPending}
                      disabled={!postConent.trim()}
                    >
                      Post
                    </Button>
                  </Dialog.Footer>
                </form>
              </Dialog.Content>
            </Dialog.Positioner>
          </Dialog.Root>
        </HStack>
      </Card.Body>
    </Card.Root>
  );
}
