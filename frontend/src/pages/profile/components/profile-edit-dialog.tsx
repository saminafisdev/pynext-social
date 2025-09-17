import {
  Button,
  CloseButton,
  Dialog,
  Editable,
  Field,
  Fieldset,
  IconButton,
} from "@chakra-ui/react";
import type { Profile } from "../types/profile";
import { Check, LucidePencilLine, X } from "lucide-react";
import { useState } from "react";
import api from "@/api/apiClient";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export default function ProfileEditDialog({ profile }: { profile: Profile }) {
  const queryClient = useQueryClient();
  const [profileBio, setProfileBio] = useState(profile?.bio);
  const { mutate: updateBio, isPending } = useMutation({
    mutationFn: async () => {
      const res = await api.patch(`profile/${profile.user.username}/`, {
        bio: profileBio,
      });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["profile", profile.user.username],
      });
    },
  });

  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>
        <Button>Edit Profile</Button>
      </Dialog.Trigger>
      <Dialog.Backdrop />
      <Dialog.Positioner>
        <Dialog.Content>
          <Dialog.CloseTrigger asChild>
            <CloseButton />
          </Dialog.CloseTrigger>
          <Dialog.Header>
            <Dialog.Title>Edit Profile</Dialog.Title>
          </Dialog.Header>
          <Dialog.Body>
            <Fieldset.Root size="lg" maxW="md">
              <Fieldset.Content>
                <Field.Root>
                  <Field.Label>Bio</Field.Label>
                  <Editable.Root defaultValue={profileBio}>
                    <Editable.Preview />
                    <Editable.Input
                      onChange={(e) => setProfileBio(e.target.value)}
                    />
                    <Editable.Control>
                      <Editable.EditTrigger asChild>
                        <IconButton variant="ghost" size="xs">
                          <LucidePencilLine />
                        </IconButton>
                      </Editable.EditTrigger>
                      <Editable.CancelTrigger asChild>
                        <IconButton variant="outline" size="xs">
                          <X />
                        </IconButton>
                      </Editable.CancelTrigger>
                      <Editable.SubmitTrigger asChild>
                        <IconButton
                          variant="outline"
                          size="xs"
                          onClick={() => updateBio()}
                          loading={isPending}
                        >
                          <Check />
                        </IconButton>
                      </Editable.SubmitTrigger>
                    </Editable.Control>
                  </Editable.Root>
                </Field.Root>
              </Fieldset.Content>
            </Fieldset.Root>
          </Dialog.Body>
          <Dialog.Footer />
        </Dialog.Content>
      </Dialog.Positioner>
    </Dialog.Root>
  );
}
