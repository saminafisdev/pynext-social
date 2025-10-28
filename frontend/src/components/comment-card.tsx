import type { Comment } from "@/pages/posts/types/comment";
import { timeAgo } from "@/lib/time";
import { HatGlasses } from "lucide-react";
import { Box, ButtonGroup, Card, HStack, Stack, Text } from "@chakra-ui/react";
import { Avatar } from "./ui/avatar";

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
          <Avatar
            src={author.profile_picture}
            size={"sm"}
            fallback={<HatGlasses />}
          />
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
          {/* <Button variant={"ghost"}>
            <Heart />
            10k
          </Button> */}
          {/* <Button variant={"ghost"}>
            <MessageCircle />
            10k
          </Button> */}
        </ButtonGroup>
      </Card.Footer>
    </Card.Root>
  );
}
