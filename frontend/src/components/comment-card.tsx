import type { Comment } from "@/pages/posts/types/comment";
import { timeAgo } from "@/lib/time";
import { Heart, MessageCircle } from "lucide-react";
import {
  Avatar,
  Box,
  Button,
  ButtonGroup,
  Card,
  HStack,
  Stack,
  Text,
} from "@chakra-ui/react";

interface CommentCardProps {
  comment: Comment;
}

export default function CommentCard({ comment }: CommentCardProps) {
  const { author } = comment;
  const { user } = author;
  return (
    <Card.Root size={"sm"} borderRadius={"none"}>
      <Card.Header>
        <HStack>
          <Avatar.Root size={"sm"}>
            <Avatar.Image src="https://images.unsplash.com/photo-1511806754518-53bada35f930" />
            <Avatar.Fallback name={user.full_name} />
          </Avatar.Root>
          <Stack gap={0}>
            <Text fontWeight={"semibold"} textStyle={"sm"}>
              {user.full_name}
            </Text>
            <Text color={"fg.muted"} textStyle={"sm"}>
              @{user.username} &bull; {timeAgo(comment.created_at)}
            </Text>
          </Stack>
          <Box marginLeft={"auto"}>
            {/* <PostMenu open={isOpen} setIsOpen={setIsOpen} /> */}
          </Box>
        </HStack>
      </Card.Header>
      <Card.Body>
        <Text whiteSpace={"pre-wrap"}>{comment.content}</Text>
      </Card.Body>
      <Card.Footer>
        <ButtonGroup size={"sm"}>
          <Button variant={"ghost"}>
            <Heart />
            10k
          </Button>
          <Button variant={"ghost"}>
            <MessageCircle />
            10k
          </Button>
        </ButtonGroup>
      </Card.Footer>
    </Card.Root>
  );
}
