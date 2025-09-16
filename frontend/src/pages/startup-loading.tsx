import { useUser } from "@/hooks/use-user";
import { AbsoluteCenter, Icon } from "@chakra-ui/react";
import type { ReactNode } from "react";

export default function LoadingRoute({ children }: { children: ReactNode }) {
  const { isLoading } = useUser();

  if (isLoading)
    return (
      <AbsoluteCenter>
        <Icon
          width={100}
          height={100}
          color={"yellow.500"}
          mx="auto"
          my={4}
          asChild
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <path
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.5"
              d="M3 15c2.483 0 4.345-3 4.345-3s1.862 3 4.345 3c2.482 0 4.965-3 4.965-3s2.483 3 4.345 3M3 20c2.483 0 4.345-3 4.345-3s1.862 3 4.345 3c2.482 0 4.965-3 4.965-3s2.483 3 4.345 3m-2-10a7 7 0 1 0-14 0"
            ></path>
          </svg>
        </Icon>
      </AbsoluteCenter>
    );

  return <>{children}</>;
}
