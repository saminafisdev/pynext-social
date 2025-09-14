import { Bookmark, Heart } from "lucide-react";
import type { Post } from "@/pages/posts/types/post";
import { timeAgo } from "@/lib/time";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/api/apiClient";
import {
  Avatar,
  Box,
  Button,
  Card,
  HStack,
  Stack,
  Text,
} from "@chakra-ui/react";
import { useNavigate } from "react-router";
import PostCommentDialog from "@/components/post-comment-dialog";
import { PostMenu } from "./post-menu";

export default function PostCard({ post }: { post: Post }) {
  const navigate = useNavigate();
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
    <Card.Root borderRadius={"none"}>
      <Card.Header>
        <HStack>
          <Avatar.Root>
            <Avatar.Image src="https://images.unsplash.com/photo-1511806754518-53bada35f930" />
            <Avatar.Fallback name={user.full_name} />
          </Avatar.Root>
          <Stack gap={0}>
            <Text fontWeight={"semibold"} textStyle={"sm"}>
              {user.full_name}
            </Text>
            <Text color={"fg.muted"} textStyle={"sm"}>
              @{user.username} &bull; {timeAgo(post.created_at)}
            </Text>
          </Stack>
          {post.is_owner && (
            <Box marginLeft={"auto"}>
              <PostMenu post={post} />
            </Box>
          )}
        </HStack>
      </Card.Header>
      <Card.Body
        onClick={() =>
          navigate(`/@${user.username}/posts/${post.id}`, {
            viewTransition: true,
          })
        }
        cursor={"pointer"}
      >
        <Text whiteSpace={"pre-wrap"}>{post.content}</Text>
      </Card.Body>
      <Card.Footer>
        <Button variant={"ghost"} onClick={() => mutate()}>
          {post.has_liked ? <Heart color="red" fill="red" /> : <Heart />}
          {post.likes_count}
        </Button>
        <PostCommentDialog post={post} />
        <Button variant={"ghost"}>
          <Bookmark />
        </Button>
      </Card.Footer>
    </Card.Root>
  );
}
