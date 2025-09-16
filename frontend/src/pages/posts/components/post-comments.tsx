import api from "@/api/apiClient";
import type { Comment } from "@/pages/posts/types/comment";
import CommentCard from "@/components/comment-card";
import { useQuery } from "@tanstack/react-query";
import PostLoadingSkeleton from "./post-loading-skeleton";
import { Box } from "@chakra-ui/react";

export default function PostComments({ postId }: { postId: number }) {
  const { data: comments, isPending: isCommentsPending } = useQuery({
    queryKey: ["comments"],
    queryFn: async () => {
      const { data } = await api.get(`posts/${postId}/comments/`);
      return data;
    },
  });
  const commentsRender = isCommentsPending ? (
    <PostLoadingSkeleton />
  ) : (
    comments.map((comment: Comment) => (
      <CommentCard key={comment.id} comment={comment} />
    ))
  );
  return <Box>{commentsRender}</Box>;
}
