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
  HoverCard,
  HStack,
  IconButton,
  Image,
  Stack,
  Text,
} from "@chakra-ui/react";
import { Link, useNavigate } from "react-router";
import PostCommentDialog from "@/components/post-comment-dialog";
import { PostMenu } from "./post-menu";
import { useState } from "react";
import { format, parseISO } from "date-fns";
import { Tooltip } from "@/components/ui/tooltip";

export default function PostCard({ post }: { post: Post }) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user } = post.author;
  const [isDialogOpen, setIsDialogOpen] = useState(false);

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

  const toggleBookmarkMutation = useMutation({
    mutationFn: async () => {
      const { data } = await api.post(`posts/${post.id}/bookmark/`, {
        post_id: post.id,
      });
      return data;
    },
    onSuccess: async (data) => {
      await Promise.all([
        queryClient.setQueryData<Post | undefined>(
          ["post", String(post.id)],
          (oldPost) => {
            if (!oldPost) return oldPost;
            return {
              ...oldPost,
              is_bookmarked: data.is_bookmarked,
            };
          }
        ),

        queryClient.setQueryData<Post[] | undefined>(["posts"], (oldPost) => {
          if (!oldPost) return oldPost;
          return oldPost.map((oldPost) => {
            if (oldPost.id !== post.id) return oldPost;
            return {
              ...oldPost,
              is_bookmarked: data.is_bookmarked,
            };
          });
        }),

        queryClient.invalidateQueries({ queryKey: ["bookmarks"] }),
      ]);
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
          <Link to={`/u/${user.username}`}>
            <Avatar.Root>
              <Avatar.Image src={post.author.profile_picture} />
              <Avatar.Fallback name={user.full_name} />
            </Avatar.Root>
          </Link>
          <Stack gap={0}>
            <HoverCard.Root positioning={{ placement: "top" }}>
              <HoverCard.Trigger asChild>
                <Text fontWeight={"semibold"} textStyle={"sm"} asChild>
                  <Link to={`/u/${user.username}`}>{user.full_name}</Link>
                </Text>
              </HoverCard.Trigger>
              <HoverCard.Positioner>
                <HoverCard.Content>
                  {/* <HoverCard.Arrow>
                    <HoverCard.ArrowTip />
                  </HoverCard.Arrow> */}
                  <HStack gap={4} alignItems={"flex-start"}>
                    <Avatar.Root>
                      <Avatar.Image src={post.author.profile_picture} />
                      <Avatar.Fallback name={user.full_name} />
                    </Avatar.Root>
                    <Stack gap={0}>
                      <Text fontWeight={"semibold"}>{user.full_name}</Text>
                      <Text color={"fg.muted"}>@{user.username}</Text>
                      <Text color={"fg.muted"}>
                        Joined {format(parseISO(user.date_joined), "LLLL yyyy")}
                      </Text>
                    </Stack>
                  </HStack>
                </HoverCard.Content>
              </HoverCard.Positioner>
            </HoverCard.Root>

            <Tooltip
              content={format(post.created_at, "LLLL d, yyyy 'at' h:mm a")}
            >
              <Text color={"fg.muted"} textStyle={"sm"}>
                @{user.username} &bull; {timeAgo(post.created_at)}
                {post.edited && "(edited)"}
              </Text>
            </Tooltip>
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
        {post?.content && <Text whiteSpace={"pre-wrap"}>{post.content}</Text>}
        {post?.image && <Image my={2} src={post.image} />}
      </Card.Body>
      <Card.Footer>
        <Button variant={"ghost"} onClick={() => mutate()}>
          {post.has_liked ? <Heart color="red" fill="red" /> : <Heart />}
          {post.likes_count}
        </Button>
        <PostCommentDialog
          post={post}
          open={isDialogOpen}
          setOpen={setIsDialogOpen}
        />
        <IconButton
          variant={"ghost"}
          onClickCapture={() => toggleBookmarkMutation.mutate()}
        >
          {post.is_bookmarked ? <Bookmark fill="black" /> : <Bookmark />}
        </IconButton>
      </Card.Footer>
    </Card.Root>
  );
}
