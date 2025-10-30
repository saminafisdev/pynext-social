import api from "@/api/apiClient";
import type { Profile } from "@/pages/profile/types/profile";
import {
  CloseButton,
  Combobox,
  Dialog,
  HStack,
  IconButton,
  InputGroup,
  Portal,
  Span,
  Spinner,
  useDialog,
  useListCollection,
} from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import { Search } from "lucide-react";
import { useState } from "react";
import { useDebounce } from "use-debounce";
import { Link } from "react-router";
import { Avatar } from "./ui/avatar";

export function GlobalSearchInput({
  dialog,
}: {
  dialog?: ReturnType<typeof useDialog>;
}) {
  const [inputValue, setInputValue] = useState("");
  const [value] = useDebounce(inputValue, 300);

  const { collection: profiles, set } = useListCollection<Profile>({
    initialItems: [],
    itemToString: (item) => item.user.full_name,
    itemToValue: (item) => item.id.toString(),
  });

  const { isLoading, isError } = useQuery<Profile[]>({
    queryKey: ["search", value],
    queryFn: async () => {
      if (!value) return [];
      const res = await api.get(`search/?q=${value}`);
      set(res.data);
      return res.data;
    },
  });

  return (
    <>
      <Combobox.Root
        collection={profiles}
        onInputValueChange={(e) => setInputValue(e.inputValue)}
        size={"lg"}
        variant={"subtle"}
      >
        <Combobox.Control>
          <InputGroup startElement={<Search />}>
            <Combobox.Input
              borderRadius={"full"}
              enterKeyHint="search"
              placeholder="Search"
            />
          </InputGroup>
          <Combobox.IndicatorGroup>
            <Combobox.ClearTrigger />
          </Combobox.IndicatorGroup>
        </Combobox.Control>
        <Portal>
          <Combobox.Positioner>
            <Combobox.Content shadow={{ mdDown: "none" }}>
              <Combobox.Empty>No profiles found</Combobox.Empty>
              {isLoading ? (
                <HStack p="2">
                  <Spinner size="xs" borderWidth="1px" />
                  <Span>Loading...</Span>
                </HStack>
              ) : isError ? (
                <Span p="2" color="fg.error">
                  Error fetching
                </Span>
              ) : (
                profiles.items?.map((profile) => (
                  <Combobox.Item item={profile} key={profile.id} asChild>
                    <Link
                      to={`/u/${profile.user.username}`}
                      onClick={() => dialog?.setOpen(false)}
                    >
                      <HStack gap={4} textStyle={"lg"}>
                        <Avatar src={profile.profile_picture} />
                        {profile.user.full_name}
                      </HStack>
                    </Link>
                  </Combobox.Item>
                ))
              )}
            </Combobox.Content>
          </Combobox.Positioner>
        </Portal>
      </Combobox.Root>
    </>
  );
}

export function GlobalSearchInputDialog() {
  const dialog = useDialog();

  return (
    <Dialog.RootProvider size={"full"} lazyMount value={dialog}>
      <Dialog.Trigger asChild>
        <IconButton variant={"ghost"}>
          <Search />
        </IconButton>
      </Dialog.Trigger>
      <Dialog.Backdrop />
      <Dialog.Positioner>
        <Dialog.Content px={2}>
          <Dialog.CloseTrigger asChild>
            <CloseButton />
          </Dialog.CloseTrigger>
          <Dialog.Header>
            <Dialog.Title>Search</Dialog.Title>
          </Dialog.Header>
          <GlobalSearchInput dialog={dialog} />
          <Dialog.Body />
        </Dialog.Content>
      </Dialog.Positioner>
    </Dialog.RootProvider>
  );
}
