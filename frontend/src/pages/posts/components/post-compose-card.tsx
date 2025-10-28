import api from "@/api/apiClient";
import { Avatar } from "@/components/ui/avatar";
import { useUser } from "@/hooks/use-user";
import {
  Box,
  Button,
  Card,
  CloseButton,
  Dialog,
  FileUpload,
  HStack,
  IconButton,
  Input,
  Separator,
  SkeletonCircle,
  Stack,
  Text,
  Textarea,
  useFileUpload,
} from "@chakra-ui/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ImagePlus } from "lucide-react";
import { useRef, useState } from "react";
import PostImageUploadList from "./post-image-upload-list";

export default function PostCompose() {
  const queryClient = useQueryClient();
  const ref = useRef<HTMLTextAreaElement | null>(null);
  const { data: profile, isLoading } = useUser();

  // Chakra UI File Upload items
  const fileUpload = useFileUpload({
    maxFiles: 1,
    maxFileSize: 3_000_000, // 3 MB
    accept: {
      "image/*": [".png", ".jpg", ".jpeg", ".gif"],
    },
  });

  const [postConent, setPostContent] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const { mutate, isPending, isError } = useMutation({
    mutationFn: () => {
      const formData = new FormData();
      formData.append("content", postConent);
      const image = fileUpload.acceptedFiles[0];
      if (image) {
        formData.append("image", image);
      }

      return api.post("posts/", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
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
                    <Box
                      bg={"bg.muted"}
                      borderWidth={"2px"}
                      borderRadius={"xl"}
                      _focusWithin={{
                        borderColor: "fg", // highlight color when textarea inside is focused
                      }}
                    >
                      <Textarea
                        autoresize
                        border={"none"}
                        outline={"none"}
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
                      <Separator />

                      <FileUpload.RootProvider value={fileUpload}>
                        <FileUpload.HiddenInput />
                        <FileUpload.Trigger asChild>
                          <IconButton variant={"ghost"} m={2}>
                            <ImagePlus />
                          </IconButton>
                        </FileUpload.Trigger>
                        <PostImageUploadList />
                      </FileUpload.RootProvider>
                    </Box>
                  </Dialog.Body>
                  <Dialog.Footer>
                    {/* <IconButton variant={"ghost"} mr={"auto"}>
                      <ImagePlus />
                    </IconButton> */}
                    <Button
                      type="submit"
                      loading={isPending}
                      disabled={
                        !postConent.trim() &&
                        fileUpload.acceptedFiles.length === 0
                      }
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
