import { useQuery } from "@tanstack/react-query";
import BookmarksCard from "./components/bookmark-card";
import api from "@/api/apiClient";
import {
  AbsoluteCenter,
  Box,
  For,
  Heading,
  HStack,
  Icon,
  Stack,
  Text,
} from "@chakra-ui/react";
import type { BookmarkInterface } from "./type";
import { Bookmark } from "lucide-react";

export default function BookmarksListPage() {
  const { data: bookmarks } = useQuery({
    queryKey: ["bookmarks"],
    queryFn: async () => {
      const { data } = await api.get("bookmarks/");
      return data;
    },
  });
  return (
    <Box py={2}>
      <HStack alignItems={"end"} gap={4} py={2}>
        {/* <Icon size={"xl"}>
          <ArrowLeft />
        </Icon> */}
        <Heading textStyle={"2xl"}>Bookmarks</Heading>
      </HStack>
      <Stack gapY={4} mt={4}>
        <For each={bookmarks} fallback={<EmptyBookmark />}>
          {(item: BookmarkInterface) => (
            <BookmarksCard key={item.id} bookmark={item} />
          )}
        </For>
      </Stack>
    </Box>
  );
}

function EmptyBookmark() {
  return (
    <AbsoluteCenter>
      <Box>
        <Text textAlign={"center"}>
          <Icon size={"2xl"}>
            <Bookmark />
          </Icon>
        </Text>
        <Text>Bookmark posts to find later.</Text>
      </Box>
    </AbsoluteCenter>
  );
}
