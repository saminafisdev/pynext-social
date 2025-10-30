import {
  Box,
  Button,
  ButtonGroup,
  Container,
  HStack,
  Icon,
  Menu,
  Text,
  VStack,
} from "@chakra-ui/react";
import {
  Bookmark,
  ChevronsUpDown,
  Home,
  MessageCircle,
  User2,
} from "lucide-react";
import { Link, Outlet, useMatch } from "react-router";
import ThemeSwitch from "../themeSwitch";
import LogoutButton from "../logout-button";
import { useUser } from "@/hooks/use-user";
import { Avatar } from "../ui/avatar";
import {
  GlobalSearchInput,
  GlobalSearchInputDialog,
} from "../global-search-input";

export function NavItem({
  to,
  children,
}: {
  to: string;
  children: React.ReactNode;
}) {
  const match = useMatch({ path: to, end: to === "/" }); // end:true for exact
  const isActive = Boolean(match);

  return (
    <Button
      fontWeight={isActive ? "extrabold" : "normal"}
      variant={isActive ? "subtle" : "ghost"}
      borderRadius={"full"}
      asChild
    >
      <Link to={to}>{children}</Link>
    </Button>
  );
}

export default function RootLayout() {
  const { data: profile } = useUser();

  const navLinks = [
    {
      name: "Home",
      href: "/",
      icon: <Home />,
      showOnMobileBottomNav: true, // Appears in the bottom bar
    },
    // {
    //   name: "Friends",
    //   href: "/friends",
    //   icon: <UsersRound />,
    //   showOnMobileBottomNav: true, // Appears in the bottom bar
    // },
    {
      name: "Profile",
      href: `/u/${[profile.user.username]}`,
      icon: <User2 />,
      showOnMobileBottomNav: true, // Appears in the bottom bar
    },
    {
      name: "Messages",
      href: "/chats",
      icon: <MessageCircle />,
      showOnMobileBottomNav: true, // Appears in the bottom bar (often combined with a "Chats" icon)
    },
    {
      name: "Bookmarks",
      href: "/bookmarks",
      icon: <Bookmark />,
      showOnMobileBottomNav: false, // Hidden from the bottom bar (reserved for desktop or hamburger menu)
    },
    // {
    //   name: "Settings",
    //   href: "/settings",
    //   icon: <Settings />,
    //   showOnMobileBottomNav: true, // Hidden from the bottom bar (reserved for desktop or hamburger menu)
    // },
  ];

  const DesktopSidebar = () => (
    <VStack
      alignItems={"start"}
      position={"sticky"}
      top={0}
      gap={0}
      h="vh"
      w={"2xs"}
      hideBelow="md"
    >
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
      <ButtonGroup
        flexGrow={1}
        flexDirection={"column"}
        alignItems={"start"}
        gap={0}
        width="full"
        variant={"ghost"}
        size={"2xl"}
      >
        {navLinks.map((link) => (
          <NavItem to={link.href} key={link.name}>
            {link.icon}
            {link.name}
          </NavItem>
        ))}
      </ButtonGroup>
      <Box w="full">
        <Menu.Root closeOnSelect={false}>
          <Menu.Trigger w="full">
            <HStack justifyContent={"center"}>
              <Avatar src={profile.profile_picture} />
              <VStack gap={0}>
                <Text textStyle={"sm"}>{profile.user.full_name}</Text>
                <Text textStyle={"sm"} color={"fg.muted"}>
                  @{profile.user.username}
                </Text>
              </VStack>
              <ChevronsUpDown />
            </HStack>
          </Menu.Trigger>
          <Menu.Positioner>
            <Menu.Content>
              <Menu.ItemGroup>
                <Menu.Item value="user">
                  <Text>{profile.user.full_name}</Text>
                  <Text>@{profile.user.username}</Text>
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
                <Menu.Item value="logout" asChild>
                  <LogoutButton />
                </Menu.Item>
              </Menu.ItemGroup>
            </Menu.Content>
          </Menu.Positioner>
        </Menu.Root>
      </Box>
    </VStack>
  );

  const MobileBottomNav = () => (
    // 2. Visible up to 'md' (mobile/small tablet)
    <HStack
      hideFrom="md"
      position="fixed"
      bottom={0}
      left={0}
      right={0}
      zIndex={10}
      bg={"bg"}
      p={2}
      justify="space-evenly"
      align="center"
      height={"64px"}
      shadow={"2xl"}
    >
      {/* Primary Navigation Icons - Max 3-5 items for bottom nav */}
      <ButtonGroup
        flexGrow={1}
        justifyContent={"space-evenly"}
        gap={0}
        width="full"
        variant={"ghost"}
        size={"xl"}
      >
        {navLinks
          .filter((link) => link.showOnMobileBottomNav)
          .map((link) => (
            <NavItem to={link.href} key={link.name}>
              {link.icon}
            </NavItem>
          ))}
        <GlobalSearchInputDialog />
        <Menu.Root closeOnSelect={false}>
          <Menu.Trigger>
            <Avatar src={profile.profile_picture} size={"sm"} />
          </Menu.Trigger>
          <Menu.Positioner>
            <Menu.Content>
              <Menu.ItemGroup>
                <Menu.Item value="user">
                  <Text>{profile.user.full_name}</Text>
                  <Text>@{profile.user.username}</Text>
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
                <Menu.Item value="logout" asChild>
                  <LogoutButton />
                </Menu.Item>
              </Menu.ItemGroup>
            </Menu.Content>
          </Menu.Positioner>
        </Menu.Root>
      </ButtonGroup>
    </HStack>
  );

  return (
    <Container fluid>
      <HStack alignItems={"start"} gap={"6"}>
        <MobileBottomNav />
        <DesktopSidebar />
        <Box as={"main"} flexGrow={1} mb={"72px"} maxW={"4xl"} w="full">
          <Outlet />
        </Box>
        <VStack
          alignItems={"start"}
          position={"sticky"}
          top={"24px"}
          gap={0}
          hideBelow={"md"}
        >
          <GlobalSearchInput />
        </VStack>
      </HStack>
    </Container>
  );
}
