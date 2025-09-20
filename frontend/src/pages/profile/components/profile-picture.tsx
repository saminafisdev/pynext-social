import { Avatar } from "@/components/ui/avatar";
import { Menu, Portal } from "@chakra-ui/react";
import type { Profile } from "../types/profile";
import { Eye } from "lucide-react";
import ChangeProfilePicture from "./change-profile-picture";

interface ProfilePictureProps {
  profile: Profile;
}

export default function ProfilePicture({ profile }: ProfilePictureProps) {
  return (
    <Menu.Root positioning={{ placement: "right-end" }} closeOnSelect={false}>
      <Menu.Trigger rounded="full" focusRing="none">
        <Avatar
          src={profile.profile_picture}
          width={120}
          height={120}
          marginY={-20}
          marginLeft={2}
        />
      </Menu.Trigger>
      <Portal>
        <Menu.Positioner>
          <Menu.Content>
            <ChangeProfilePicture profile={profile} />
            <Menu.Item value="view">
              <Eye /> View Profile Picture
            </Menu.Item>
          </Menu.Content>
        </Menu.Positioner>
      </Portal>
    </Menu.Root>
  );
}
