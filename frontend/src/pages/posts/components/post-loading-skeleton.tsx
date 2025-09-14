import {
  Card,
  HStack,
  Skeleton,
  SkeletonCircle,
  SkeletonText,
  Stack,
} from "@chakra-ui/react";

export default function PostLoadingSkeleton() {
  return (
    <Card.Root borderRadius={"none"}>
      <Card.Header>
        <HStack>
          <SkeletonCircle size={12} />
          <Stack flexGrow={1}>
            <Skeleton height="5" width={"xs"} />
            <Skeleton height="5" width={"xs"} />
          </Stack>
        </HStack>
      </Card.Header>
      <Card.Body>
        <SkeletonText />
      </Card.Body>
      <Card.Footer></Card.Footer>
    </Card.Root>
  );
}
