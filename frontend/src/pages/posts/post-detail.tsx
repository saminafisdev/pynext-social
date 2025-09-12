import api from "@/api/apiClient";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router";
import PostCard from "./components/post-card";
import type { Comment } from "./types/comment";
import CommentCard from "@/components/comment-card";
import CommentComposerCard from "@/components/comment-composer-card";

export default function PostDetail() {
  const { id } = useParams();
  const { data: post, isPending } = useQuery({
    queryKey: ["post"],
    queryFn: async () => {
      const { data } = await api.get(`posts/${id}`);
      return data;
    },
  });
  const { data: comments, isPending: isCommentsPending } = useQuery({
    queryKey: ["comments"],
    queryFn: async () => {
      const { data } = await api.get(`posts/${id}/comments/`);
      return data;
    },
  });

  if (isPending) return <p>Loading...</p>;
  const commentsRender = isCommentsPending ? (
    <p>Loading...</p>
  ) : (
    comments.map((comment: Comment) => (
      <CommentCard key={comment.id} comment={comment} />
    ))
  );

  return (
    <div>
      <PostCard post={post} />
      <CommentComposerCard post_id={id} />
      {commentsRender}
    </div>
  );
}
