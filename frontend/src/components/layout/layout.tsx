import {
  Avatar,
  Box,
  Button,
  Circle,
  Container,
  Float,
  HStack,
  Icon,
  Input,
  InputGroup,
  Menu,
  Text,
  VStack,
} from "@chakra-ui/react";
import {
  Bookmark,
  ChevronsUpDown,
  Home,
  LogOut,
  MessageCircle,
  Search,
  Settings,
  User2,
} from "lucide-react";
import { Link, Outlet } from "react-router";
import ThemeSwitch from "../themeSwitch";

export default function RootLayout() {
  return (
    <Container maxW={"6xl"}>
      <HStack alignItems={"start"} gap={"6"}>
        <VStack alignItems={"start"} position={"sticky"} top={0} gap={0} h="vh">
          <Icon size={"2xl"} color={"yellow.500"} mx="auto" my={4}>
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
          <VStack flexGrow={1} alignItems={"start"}>
            <Button variant={"ghost"} size={"2xl"} asChild>
              <Link to={"/"}>
                <Home />
                Home
              </Link>
            </Button>
            <Button variant={"ghost"} size={"2xl"} position={"relative"}>
              <MessageCircle />
              Messages
              <Float>
                <Circle size="5" bg="blue.500" color="white">
                  3
                </Circle>
              </Float>
            </Button>
            <Button variant={"ghost"} size={"2xl"}>
              <User2 />
              Friends
            </Button>
            <Button variant={"ghost"} size={"2xl"}>
              <Bookmark />
              Bookmarks
            </Button>
            <Button variant={"ghost"} size={"2xl"}>
              <Settings />
              Settings
            </Button>
          </VStack>
          <Box w="full">
            <Menu.Root closeOnSelect={false}>
              <Menu.Trigger w="full">
                <HStack justifyContent={"center"}>
                  <Avatar.Root>
                    <Avatar.Image src="https://images.unsplash.com/photo-1511806754518-53bada35f930" />
                    <Avatar.Fallback name="Nate Foss" />
                  </Avatar.Root>
                  <VStack gap={0}>
                    <Text textStyle={"sm"}>John Doe</Text>
                    <Text textStyle={"sm"} color={"fg.muted"}>
                      @john.doe
                    </Text>
                  </VStack>
                  <ChevronsUpDown />
                </HStack>
              </Menu.Trigger>
              <Menu.Positioner>
                <Menu.Content>
                  <Menu.ItemGroup>
                    <Menu.Item value="user">
                      <Text>John Doe</Text>
                      <Text>@john.doe</Text>
                    </Menu.Item>
                  </Menu.ItemGroup>
                  <Menu.Separator />
                  <Menu.Arrow />
                  <Menu.ItemGroup>
                    <Menu.Item value="theme">
                      <ThemeSwitch />
                    </Menu.Item>
                  </Menu.ItemGroup>
                  <Menu.Separator />
                  <Menu.Arrow />
                  <Menu.ItemGroup>
                    <Menu.Item value="logout">
                      <LogOut />
                      Sign out
                    </Menu.Item>
                  </Menu.ItemGroup>
                </Menu.Content>
              </Menu.Positioner>
            </Menu.Root>
          </Box>
        </VStack>
        <Box as={"main"} flexGrow={1}>
          <Outlet />
        </Box>
        <VStack alignItems={"start"} position={"sticky"} top={"24px"} gap={0}>
          <InputGroup startElement={<Search />}>
            <Input
              placeholder="Search Gull"
              variant={"subtle"}
              borderRadius={"full"}
              size={"lg"}
            />
          </InputGroup>
        </VStack>
      </HStack>
    </Container>
  );
}
