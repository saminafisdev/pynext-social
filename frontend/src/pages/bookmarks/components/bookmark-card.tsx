import { Box, Card, IconButton, Image } from "@chakra-ui/react";
import type { BookmarkInterface } from "../type";
import { BookmarkMinus } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/api/apiClient";

export default function BookmarksCard({
  bookmark,
}: {
  bookmark: BookmarkInterface;
}) {
  const queryClient = useQueryClient();
  const { mutate, isPending } = useMutation({
    mutationFn: async () => {
      const { data } = await api.delete(`bookmarks/${bookmark.id}/`);
      return data;
    },
    onSuccess: () => [
      queryClient.invalidateQueries({ queryKey: ["bookmarks"] }),
    ],
  });

  return (
    <Card.Root flexDirection="row" overflow="hidden" maxHeight={"200px"}>
      <Image
        objectFit="cover"
        maxW="3/12"
        src={bookmark.post.image ?? bookmark.post.author.profile_picture}
        alt={`Post by ${bookmark.post.author.user.full_name}`}
      />
      <Box>
        <Card.Body>
          <Card.Title mb="2" textStyle={{ base: "sm", md: "md" }}>
            {bookmark.post.author.user.full_name} posted
          </Card.Title>
          <Card.Description
            lineClamp={2}
            textStyle={{ base: "md", md: "lg" }}
            color={"fg"}
          >
            {bookmark.post.content}
          </Card.Description>
        </Card.Body>
        <Card.Footer>
          <IconButton
            variant={"surface"}
            borderRadius={"full"}
            onClick={() => mutate()}
            loading={isPending}
          >
            <BookmarkMinus />
          </IconButton>
        </Card.Footer>
      </Box>
    </Card.Root>
  );
}
