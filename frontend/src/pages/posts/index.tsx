import { Box } from "@chakra-ui/react";
import PostComposeCard from "./components/post-compose-card";
import PostList from "./components/post-list";

export default function Page() {
  return (
    <Box maxW={"3xl"}>
      <PostComposeCard />
      <PostList />
    </Box>
  );
}
