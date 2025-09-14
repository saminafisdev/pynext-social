"use client";

import { HStack, Switch } from "@chakra-ui/react";
import { Moon } from "lucide-react";
import { useState } from "react";
import { useColorMode } from "./ui/color-mode";

export default function ThemeSwitch() {
  const { colorMode, toggleColorMode } = useColorMode();

  const darkMode = colorMode === "light" ? false : true;
  const [isDarkMode, setIsDarkMode] = useState(darkMode);

  return (
    <Switch.Root
      checked={isDarkMode}
      onCheckedChange={(e) => {
        setIsDarkMode(e.checked);
        toggleColorMode();
      }}
    >
      <Switch.HiddenInput />
      <Switch.Label>
        <HStack>
          <Moon />
          Dark Mode
        </HStack>
      </Switch.Label>
      <Switch.Control>
        <Switch.Thumb />
      </Switch.Control>
    </Switch.Root>
  );
}
