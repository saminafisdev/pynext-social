import { useQuery } from "@tanstack/react-query";
import PostCard from "@/pages/posts/components/post-card";
import type { Post } from "@/pages/posts/types/post";
import PostLoadingSkeleton from "@/pages/posts/components/post-loading-skeleton";
import api from "@/api/apiClient";

export default function PostList() {
  const {
    data: posts,
    isError,
    isPending,
  } = useQuery({
    queryKey: ["posts"],
    queryFn: async () => {
      const { data } = await api.get("posts/");
      return data;
    },
  });

  if (isPending) return <PostLoadingSkeleton />;
  if (isError) return <p>There was an error fetching posts</p>;
  return (
    <div className="space-y-4">
      {posts.map((post: Post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  );
}
