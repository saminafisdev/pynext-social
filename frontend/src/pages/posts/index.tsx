import api from "@/api/apiClient";
import { useQuery } from "@tanstack/react-query";
import PostCard from "./components/post-card";
import type { Post } from "@/pages/posts/types/post";

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
      <h1>Your Feed</h1>
      {posts.map((post: Post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  );
}

const fetchAllPosts = async () => {
  const { data } = await api.get("posts/");
  return data;
};
