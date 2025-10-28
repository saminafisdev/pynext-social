import api from "@/api/apiClient";
import { useQuery } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router";
import PostCard from "./components/post-card";
import CommentComposerCard from "@/components/comment-composer-card";
import PostLoadingSkeleton from "./components/post-loading-skeleton";
import PostComments from "./components/post-comments";
import { Box, HStack, IconButton, Text } from "@chakra-ui/react";
import { ArrowLeft } from "lucide-react";

export default function PostDetail() {
  const { postId } = useParams();
  const navigate = useNavigate();
  const { data: post, isPending } = useQuery({
    queryKey: ["post", postId],
    queryFn: async () => {
      const { data } = await api.get(`posts/${postId}`);
      return data;
    },
  });

  if (isPending) return <PostLoadingSkeleton />;

  return (
    <Box maxW={"3xl"}>
      <HStack bg={"bg.subtle"} alignItems={"center"} p={4}>
        <IconButton variant={"ghost"} onClick={() => navigate(-1)}>
          <ArrowLeft />
        </IconButton>
        <Text fontSize={"lg"}>Post</Text>
      </HStack>
      <PostCard post={post} />
      <CommentComposerCard post_id={postId} />
      <PostComments postId={Number(postId)} />
    </Box>
  );
}
