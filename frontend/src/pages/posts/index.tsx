import api from "@/api/apiClient";
import { useQuery } from "@tanstack/react-query";
import PostCard from "@/pages/posts/components/post-card";
import type { Post } from "@/pages/posts/types/post";
import PostComposeCard from "./components/post-compose-card";

export default function Page() {
  const {
    data: posts,
    isError,
    isPending,
  } = useQuery({
    queryKey: ["posts"],
    queryFn: fetchAllPosts,
  });

  if (isPending) return <p>Loading..</p>;
  if (isError) return <p>There was an error fetching posts</p>;

  return (
    <div>
      <PostComposeCard />
      <div className="space-y-4">
        {posts.map((post: Post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
    </div>
  );
}

const fetchAllPosts = async () => {
  const { data } = await api.get("posts/");
  return data;
};
