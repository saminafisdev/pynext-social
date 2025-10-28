import api from "@/api/apiClient";
import {
  Button,
  CloseButton,
  Dialog,
  Image,
  Input,
  Menu,
  Portal,
} from "@chakra-ui/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Pencil } from "lucide-react";
import { useRef, useState } from "react";
import type { Profile } from "../types/profile";

export default function ChangeProfilePicture({
  profile,
}: {
  profile: Profile;
}) {
  const [preview, setPreview] = useState<string | undefined>(undefined);
  const [file, setFile] = useState<File | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: async () => {
      if (!file) return;
      const formData = new FormData();
      formData.append("profile_picture", file);
      const data = await api.put(
        `profiles/${profile.user.username}/`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return data;
    },
    onSuccess: () => {
      setPreview(undefined);
      setFile(null);
      queryClient.invalidateQueries({
        queryKey: ["profile", profile.user.username],
      });
      window.location.reload();
    },
  });

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selected = event.target.files?.[0];
    if (!selected) return;

    setFile(selected);

    const url = URL.createObjectURL(selected);
    setPreview(url);
  };

  return (
    <Dialog.Root open={!!preview} onOpenChange={() => setPreview(undefined)}>
      <Dialog.Trigger>
        <Menu.Item value="change" onClick={() => inputRef.current?.click()}>
          <Pencil /> Change Profile Picture
        </Menu.Item>
      </Dialog.Trigger>
      <Input
        type="file"
        accept="image/*"
        display={"none"}
        onChange={handleChange}
        ref={inputRef}
      />
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content>
            <Dialog.Header>
              <Dialog.Title>Change Profile Picture</Dialog.Title>
            </Dialog.Header>
            <Dialog.Body>
              <Image src={preview} alt="Profile Picture Preview" />
            </Dialog.Body>
            <Dialog.Footer>
              <Dialog.ActionTrigger asChild>
                <Button variant="outline">Cancel</Button>
              </Dialog.ActionTrigger>
              <Button onClick={() => mutate()} loading={isPending}>
                Upload
              </Button>
            </Dialog.Footer>
            <Dialog.CloseTrigger asChild>
              <CloseButton size="sm" />
            </Dialog.CloseTrigger>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
}
