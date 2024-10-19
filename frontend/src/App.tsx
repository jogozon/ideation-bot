import React from "react";
import { ThemeProvider } from "./components/theme-provider";
import ChatInterface from "./ChatInterface";

const App = () => {
  return (
    <ThemeProvider>
      <ChatInterface />
    </ThemeProvider>
  );
};

export default App;
