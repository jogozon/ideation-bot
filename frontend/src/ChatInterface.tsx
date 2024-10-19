import React from "react";
import { useEffect, useState, useRef } from "react";
import { Input } from "./components/ui/input";
import { Button } from "./components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "./components/ui/avatar";
import ChatbotSelector from "./components/ChatbotSelector";
import { ModeToggle } from "./components/mode-toggle";

const initialMessages = [
  {
    id: 1,
    text: "Hello, how are you?",
    sender: "Contrarian",
    avatar: "https://github.com/nutlope.png",
    isMe: false,
  },
  {
    id: 2,
    text: "I am good, thanks!",
    sender: "Visionary",
    avatar: "https://github.com/nutlope.png",
    isMe: false,
  },
  {
    id: 3,
    text: "What are you doing today?",
    sender: "Librarian",
    avatar: "https://github.com/nutlope.png",
    isMe: false,
  },
];

const ChatInterface = () => {
  const [messages, setMessages] = useState(initialMessages);
  const [newMessage, setNewMessage] = useState("");
  const [username, setUsername] = useState("You");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const handleSendMessage = () => {
    if (newMessage.trim() !== "") {
      const newMessageObject = {
        id: messages.length + 1,
        text: newMessage,
        sender: username,
        avatar: "https://github.com/nutlope.png",
        isMe: true,
      };
      setMessages([...messages, newMessageObject]);
      setNewMessage("");
    }
  };
  return (
    <div className="bg- flex flex-col h-screen p-4">
      <div className="flex flex-col p-4 rounded shadow-md mb-4">
        <h2 className="text-lg font-bold mb-2">Group Chat</h2>
        <div className="flex flex-col overflow-y-scroll max-h-[500px]">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex mb-2 ${message.isMe ? "justify-end" : ""}`}
            >
              {message.isMe ? (
                <div className=" bg-white p-2 rounded">
                  <p className="text-sm font-bold">{message.sender}</p>
                  <p className="text-sm">{message.text}</p>
                </div>
              ) : (
                <div className="flex">
                  <Avatar className="mr-2">
                    <AvatarImage src={message.avatar} />
                    <AvatarFallback>{message.sender[0]}</AvatarFallback>
                  </Avatar>
                  <div className="p-2 rounded">
                    <p className="text-sm font-bold">{message.sender}</p>
                    <p className="text-sm">{message.text}</p>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          ))}
        </div>
      </div>
      <div className="p-4">
        <ChatbotSelector
          chatbots={["Contrarian", "Visionary", "Librarian"]}
          selectedChatbots={["Contrarian"]}
          onChange={(selected) => setUsername(selected[0])}
        />
      </div>
      <div className="flex p-4 rounded shadow-md">
        <Input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message..."
          className="w-full mr-2"
        />
        <Button onClick={handleSendMessage}>Send</Button>
      </div>
      <ModeToggle />
    </div>
  );
};

export default ChatInterface;
