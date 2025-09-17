import { Box, Skeleton, SkeletonCircle } from "@chakra-ui/react";

export default function ProfileLoadingSkeleton() {
  return (
    <Box>
      {/* cover image skeleton */}
      <Skeleton height="200px" width="100%" />

      {/* avatar overlaps the cover — use negative margin to match */}
      <SkeletonCircle size="120px" mt={-20} ml={2} />
    </Box>
  );
}
