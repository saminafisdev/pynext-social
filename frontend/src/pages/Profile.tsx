import api from "@/api/apiClient";
import { Avatar } from "@/components/ui/avatar";
import {
  Box,
  Button,
  HStack,
  Image,
  Stack,
  Tabs,
  Text,
} from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router";
import { CalendarDays } from "lucide-react";
import ProfileEditDialog from "./profile/components/profile-edit-dialog";
import ProfilePosts from "./profile/components/profile-posts";
import ProfileLoadingSkeleton from "./profile/components/profile-loading-skeleton";
import { format, parseISO } from "date-fns";

export default function ProfilePage() {
  const { username } = useParams();

  const { data: profile, isPending } = useQuery({
    queryKey: ["profile", username],
    queryFn: async () => {
      const { data } = await api.get(`profiles/${username}/`);
      return data;
    },
  });

  if (isPending) return <ProfileLoadingSkeleton />;

  return (
    <Stack>
      <Box>
        {profile.cover_photo ? (
          <Image height={200} width={"full"} src={profile.cover_photo} />
        ) : (
          <Box height={200} width={"full"} bg={"bg.muted"} />
        )}
        <Avatar
          src={profile.profile_picture}
          width={120}
          height={120}
          marginY={-20}
          marginLeft={2}
        />
      </Box>
      <HStack alignItems={"center"} justifyContent={"space-between"}>
        <Stack gap={0} mt="4">
          <Text fontWeight={"bold"} textStyle={"2xl"}>
            {profile.user.full_name}
          </Text>
          <Text color={"fg.muted"}>@{profile.user.username}</Text>
        </Stack>
        {profile.is_owner ? (
          <ProfileEditDialog profile={profile} />
        ) : (
          <Button>Add Friend</Button>
        )}
      </HStack>
      <Text>{profile.bio}</Text>
      <HStack color={"fg.muted"} textStyle={"md"} alignItems={"center"}>
        <CalendarDays size={16} />
        <Text>
          Joined {format(parseISO(profile.user.date_joined), "LLLL yyyy")}
        </Text>
      </HStack>
      <Tabs.Root defaultValue={"posts"} mt={6}>
        <Tabs.List>
          <Tabs.Trigger value="posts" textStyle={"lg"}>
            Posts
          </Tabs.Trigger>
          <Tabs.Indicator />
        </Tabs.List>
        <Tabs.Content value="posts">
          <ProfilePosts profile={profile} />
        </Tabs.Content>
      </Tabs.Root>
    </Stack>
  );
}
