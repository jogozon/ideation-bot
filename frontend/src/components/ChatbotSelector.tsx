// src/components/ChatbotSelector.tsx
import React, { useState } from "react";
import contrarianImage from '../assets/contrarian_profile.png';
import supporterImage from '../assets/supporter_profile.png';
import librarianImage from '../assets/intelligent_profile.png';
import { Toggle } from "./ui/toggle";
import { Avatar, AvatarImage, AvatarFallback } from "./ui/avatar";
interface ChatbotSelectorProps {
  chatbots: string[];
  selectedChatbots: string[];
  onChange: (selected: string[]) => void;
}


const ChatbotSelector: React.FC<ChatbotSelectorProps> = ({
  chatbots,
  selectedChatbots,
  onChange,
}) => {
  const [activeToggles, setActiveToggles] = useState<{
    [key: string]: boolean;
  }>({});

  const users = [
    {
      name: "Contrarian",
      image: contrarianImage
    },
    {
      name: "Librarian",
      image: librarianImage
    },
    {
      name: "Visionary",
      image: supporterImage
    }
  ];

  const handleToggle = (name: string) => {
    setActiveToggles((prev) => ({ ...prev, [name]: !prev[name] }));
  };

  return (
    <div className="flex space-x-2">
      {users.map((user) => (
        <Toggle
          key={user.name}
          aria-label={`Toggle ${user.name}`}
          className={`p-0 h-12 w-12 transition-all duration-200 ease-in-out
              ${activeToggles[user.name]
              ? "ring-2 ring-primary"
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
                  ${activeToggles[user.name] ? "opacity-70" : "opacity-100"}
                `}
            />
            <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
          </Avatar>
        </Toggle>
      ))}
    </div>
  );
};

export default ChatbotSelector;
