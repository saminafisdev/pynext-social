import api from "@/api/apiClient";
import { Box, Text } from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";

import PostCard from "@/pages/posts/components/post-card";
import type { Post } from "@/pages/posts/types/post";
import type { Profile } from "../types/profile";
import PostLoadingSkeleton from "@/pages/posts/components/post-loading-skeleton";

export default function ProfilePosts({ profile }: { profile: Profile }) {
  const {
    data: posts,
    isPending,
    isError,
  } = useQuery({
    queryKey: ["posts", profile.id],
    queryFn: async () => {
      const { data } = await api.get(`posts/?author=${profile.id}`);
      return data;
    },
  });

  if (isPending) return <PostLoadingSkeleton />;
  if (isError)
    return (
      <Box>
        <Text>Couldn't fetch posts. Try again later.</Text>
      </Box>
    );

  return (
    <Box>
      {posts?.map((post: Post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </Box>
  );
}
