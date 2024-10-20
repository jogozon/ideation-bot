// src/components/ChatbotSelector.tsx
import React, { useState } from "react";
import contrarianImage from "../assets/contrarian_profile.png";
import supporterImage from "../assets/supporter_profile.png";
import { Toggle } from "./ui/toggle";
import { Avatar, AvatarImage, AvatarFallback } from "./ui/avatar";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "./ui/hover-card";
interface ChatbotSelectorProps {
  selectedChatbots: string[];
  setChatbots: React.Dispatch<React.SetStateAction<string[]>>;
}

const users = [
  { name: "contrarian", image: contrarianImage },
  { name: "visionary", image: supporterImage },
];

const ChatbotSelector: React.FC<ChatbotSelectorProps> = ({
  selectedChatbots,
  setChatbots,
}) => {
  const [activeToggles, setActiveToggles] = useState<{
    [key: string]: boolean;
  }>({
    contrarian: true,
    librarian: true,
    visionary: true,
  });

  const handleToggle = (name: string) => {
    setActiveToggles((prevActiveToggles) => {
      // Toggle the active state for the specific chatbot
      const newActiveToggles = {
        ...prevActiveToggles,
        [name]: !prevActiveToggles[name],
      };

      // Update selectedChatbots based on the new activeToggles state
      if (!newActiveToggles[name]) {
        setChatbots((prevChatbots) =>
          prevChatbots.filter((bot) => bot !== name)
        );
      } else {
        if (selectedChatbots.includes(name)) {
          return newActiveToggles;
        }
        setChatbots((prevChatbots) => [...prevChatbots, name]);
      }

      return newActiveToggles;
    });
    console.log(activeToggles);
    console.log(selectedChatbots);
  };

  return (
    <div className="flex space-x-2">
      {users.map((user) => (
        <HoverCard>
          <HoverCardTrigger>
            <Toggle
              key={user.name}
              aria-label={`Toggle ${user.name}`}
              className={`p-0 h-12 w-12 transition-all duration-200 ease-in-out
                    ${
                      activeToggles[user.name]
                        ? "ring-2 ring-white"
                        : "hover:scale-110"
                    }
                    `}
              pressed={activeToggles[user.name]}
              onPressedChange={() => handleToggle(user.name)}
            >
              <Avatar
                className={`h-12 w-12 flex item-center justify-center transition-all duration-200 ease-in-out
                    ${activeToggles[user.name] ? "bg-primary" : "bg-secondary"}
                    `}
              >
                <AvatarImage
                  src={user.image}
                  alt={`Puppy representing ${user.name}`}
                  className={`w-10 h-10 object-contain transition-all duration-200 ease-in-out
                        ${
                          activeToggles[user.name]
                            ? "opacity-100"
                            : "opacity-70"
                        }
                        `}
                />
                <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
              </Avatar>
            </Toggle>
          </HoverCardTrigger>
          <HoverCardContent className="bg-white w-30">
            <p className="text-sm text-slate-900 text-center fill-white">{user.name}</p>
          </HoverCardContent>
        </HoverCard>
      ))}
    </div>
  );
};

export default ChatbotSelector;
