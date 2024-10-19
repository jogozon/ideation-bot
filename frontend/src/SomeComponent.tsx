import React from "react";
import { ThemeProvider } from "./components/theme-provider";
import { ModeToggle } from "./components/mode-toggle";

const SomeComponent = () => {
  return (
    <ThemeProvider>
      <ModeToggle />
    </ThemeProvider>
  );
}

export default SomeComponent;
