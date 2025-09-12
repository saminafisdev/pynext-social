import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MessageCircle, ThumbsUp } from "lucide-react";
import type { Post } from "@/pages/posts/types/post";
import { Separator } from "@/components/ui/separator";
import { timeAgo } from "@/lib/time";
import { PostMenu } from "./post-menu";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/api/apiClient";
import { NavLink } from "react-router";

export default function PostCard({ post }: { post: Post }) {
  const queryClient = useQueryClient();
  const { user } = post.author;

  const { mutate } = useMutation({
    mutationFn: toggleLike,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["posts"],
      });
      queryClient.invalidateQueries({
        queryKey: ["post", String(post.id)],
      });
    },
  });

  async function toggleLike() {
    const { data } = await api.post(`posts/${post.id}/toggle_like/`);
    return data;
  }

  return (
    <Card className="w-full max-w-xl">
      <CardHeader>
        <div className="flex items-center gap-x-2">
          <Avatar className="size-10">
            <AvatarImage src="https://github.com/shadcn.png" />
            <AvatarFallback>
              {user.full_name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>
          <div>
            <CardTitle>{post.author.user.full_name}</CardTitle>
            <CardDescription>
              <span>@{post.author.user.username}</span>
              <span className="mx-2">&bull;</span>
              <NavLink to={`/@${post.author.user.username}/posts/${post.id}`}>
                {timeAgo(post.created_at)}
              </NavLink>
              {post.edited && <span className="ml-1">(edited)</span>}
            </CardDescription>
          </div>
        </div>
        {post.is_owner && (
          <CardAction>
            <PostMenu post={post} />
          </CardAction>
        )}
      </CardHeader>
      <CardContent>
        <p className="break-words">{post.content}</p>
      </CardContent>
      <Separator />
      <CardFooter>
        <Button variant={"ghost"} onClick={() => mutate()}>
          <ThumbsUp
            className={post.has_liked ? "fill-blue-500 text-blue-700" : ""}
          />
          <span>{post.likes_count}</span>
        </Button>
        <Button variant={"ghost"}>
          <MessageCircle />
          <span>{post.comments_count}</span>
        </Button>
      </CardFooter>
    </Card>
  );
}
