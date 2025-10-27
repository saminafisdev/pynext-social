import {
  Avatar,
  Box,
  Dialog,
  HStack,
  Input,
  InputGroup,
  LinkBox,
  LinkOverlay,
  Portal,
  ScrollArea,
  Stack,
  Text,
} from "@chakra-ui/react";
import { Search } from "lucide-react";
import { type PropsWithChildren, useEffect, useState } from "react";
import { useChatProfiles } from "@/hooks/use-chat-search";
import { Link } from "react-router";

// Intentionally no local mock types/data. Profiles are fetched from the API.

function useDebouncedValue<T>(value: T, delayMs: number) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delayMs);
    return () => clearTimeout(id);
  }, [value, delayMs]);
  return debounced;
}

export function NewMessageDialogTrigger({ children }: PropsWithChildren) {
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebouncedValue(search, 300);
  const { data, isLoading, isError } = useChatProfiles(debouncedSearch);
  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>{children}</Dialog.Trigger>
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content maxW="lg">
            <Dialog.Header>
              <Dialog.Title>New message</Dialog.Title>
            </Dialog.Header>
            <Dialog.Body>
              <Stack gap={4}>
                <InputGroup startElement={<Search />}>
                  <Input
                    placeholder="Search users"
                    variant="subtle"
                    borderRadius="full"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </InputGroup>
                <Box>
                  <ScrollArea.Root size="sm" maxH="72">
                    <ScrollArea.Viewport>
                      <ScrollArea.Content>
                        <Stack>
                          {isLoading && (
                            <Text color="fg.muted">Loading profiles…</Text>
                          )}
                          {isError && (
                            <Text color="red.500">Failed to load profiles</Text>
                          )}
                          {!isLoading && !isError && data && (
                            <>
                              {/* Your Chats Section */}
                              {data.chats && data.chats.length > 0 && (
                                <>
                                  <Text
                                    fontSize="sm"
                                    fontWeight="semibold"
                                    color="fg.muted"
                                    px={2}
                                  >
                                    Your chats
                                  </Text>
                                  {data.chats.map((chat) => (
                                    <HStack
                                      key={chat.id}
                                      p={2}
                                      _hover={{
                                        bg: "bg.muted",
                                        cursor: "pointer",
                                      }}
                                      borderRadius="md"
                                    >
                                      <Avatar.Root>
                                        <Avatar.Fallback
                                          name={chat.other_user}
                                        />
                                      </Avatar.Root>
                                      <Stack lineHeight="shorter">
                                        <Text fontWeight="medium">
                                          {chat.other_user}
                                        </Text>
                                        <Text color="fg.muted" fontSize="sm">
                                          Chat
                                        </Text>
                                      </Stack>
                                    </HStack>
                                  ))}
                                </>
                              )}

                              {/* Suggested Profiles Section */}
                              {data.suggested_profiles &&
                                data.suggested_profiles.length > 0 && (
                                  <>
                                    <Text
                                      fontSize="sm"
                                      fontWeight="semibold"
                                      color="fg.muted"
                                      px={2}
                                      mt={
                                        data.chats && data.chats.length > 0
                                          ? 4
                                          : 0
                                      }
                                    >
                                      Suggested Profiles
                                    </Text>
                                    {data.suggested_profiles.map((p) => (
                                      <LinkBox
                                        key={p.id}
                                        as={HStack}
                                        p={2}
                                        _hover={{
                                          bg: "bg.muted",
                                          cursor: "pointer",
                                        }}
                                        borderRadius="md"
                                      >
                                        <Avatar.Root>
                                          <Avatar.Fallback
                                            name={p.user.full_name}
                                          />
                                          <Avatar.Image
                                            src={p.profile_picture ?? undefined}
                                          />
                                        </Avatar.Root>
                                        <Stack lineHeight="shorter">
                                          <Text fontWeight="medium">
                                            {p.user.full_name}
                                          </Text>
                                          <Text color="fg.muted" fontSize="sm">
                                            {p.user.username}
                                          </Text>
                                        </Stack>
                                        <LinkOverlay asChild>
                                          <Link
                                            to={`/chats/new/?profileId=${p.id}`}
                                          />
                                        </LinkOverlay>
                                      </LinkBox>
                                    ))}
                                  </>
                                )}

                              {/* No results message */}
                              {(!data.chats || data.chats.length === 0) &&
                                (!data.suggested_profiles ||
                                  data.suggested_profiles.length === 0) &&
                                debouncedSearch && (
                                  <Text
                                    color="fg.muted"
                                    textAlign="center"
                                    py={4}
                                  >
                                    No results found for "{debouncedSearch}"
                                  </Text>
                                )}
                            </>
                          )}
                        </Stack>
                      </ScrollArea.Content>
                    </ScrollArea.Viewport>
                    <ScrollArea.Scrollbar>
                      <ScrollArea.Thumb />
                    </ScrollArea.Scrollbar>
                    <ScrollArea.Corner />
                  </ScrollArea.Root>
                </Box>
              </Stack>
            </Dialog.Body>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
}
