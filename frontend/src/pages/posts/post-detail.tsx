import api from "@/api/apiClient";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router";
import PostCard from "./components/post-card";
import CommentComposerCard from "@/components/comment-composer-card";
import PostLoadingSkeleton from "./components/post-loading-skeleton";
import PostComments from "./components/post-comments";

export default function PostDetail() {
  const { postId } = useParams();
  const { data: post, isPending } = useQuery({
    queryKey: ["post", postId],
    queryFn: async () => {
      const { data } = await api.get(`posts/${postId}`);
      return data;
    },
  });

  if (isPending) return <PostLoadingSkeleton />;

  return (
    <div>
      <PostCard post={post} />
      <CommentComposerCard post_id={postId} />
      <PostComments postId={Number(postId)} />
    </div>
  );
}
