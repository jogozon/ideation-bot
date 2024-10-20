import { useEffect, useState, useRef } from "react";
import { Input } from "./components/ui/input";
import { Button } from "./components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "./components/ui/avatar";
import ChatbotSelector from "./components/ChatbotSelector";
import axios from "axios";

const initialMessages = [
  {
    text: "Hope you're ready to rumbleeeeeee!",
    sender: "Contrarian",
    avatar: "",
  },
  {
    text: "Teamwork makes the dreamwork!",
    sender: "Visionary",
    avatar: "",
  }
];

interface BotResponse {
  raw: string;
  pydantic: null | any; // Adjust this type as needed
  json_dict: null | any; // Adjust this type as needed
  tasks_output: Array<{
    description: string;
    name: null | string; // Adjust this type as needed
    expected_output: string;
    summary: string;
    raw: string;
    pydantic: null | any; // Adjust this type as needed
    json_dict: null | any; // Adjust this type as needed
    agent: string;
    output_format: string;
  }>;
  token_usage: {
    total_tokens: number;
    prompt_tokens: number;
    completion_tokens: number;
    successful_requests: number;
  };
}

interface ResponseData {
  contrarian: BotResponse;
  visionary: BotResponse;
}

// const loadingMessage = {
//     <script src="https://unpkg.com/@dotlottie/player-component@latest/dist/dotlottie-player.mjs" type="module"></script> 

//     <dotlottie-player src="https://lottie.host/df7025df-5f5a-48f3-8b12-d672f47b0d41/Zilhgfygxm.json" background="transparent" speed="1" style="width: 300px; height: 300px;" loop autoplay></dotlottie-player>
// }

const ChatInterface = () => {
  const [messages, setMessages] = useState(initialMessages);
  const [newMessage, setNewMessage] = useState("");
  const username = "You";
  const [selectedBots, setChatbots] = useState(["contrarian", "visionary"]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const handleSendMessage = async () => {
    let userMessage = {
      text: newMessage,
      sender: username,
      avatar: "",
    };
    setMessages([...messages, userMessage]);
    if (newMessage.trim() == "") {
      return;
    }
    setLoading(true);
    try {
      const response = await axios.get<ResponseData>(
        `http://localhost:8000/conversation/?query=${newMessage}`
      );
      const resData = response.data;
      if (response) {
        // Extract the 'raw' values
        const contrarianRaw = resData.contrarian.raw;
        const visionaryRaw = resData.visionary.raw;
        let contrarianMessage = {
          text: contrarianRaw, // Access the 'text' property of 'response.responses[0]'
          sender: "contrarian",
          avatar: "",
        };
        let supporterMessage = {
          text: visionaryRaw, // Access the 'text' property of 'response.responses[0]'
          sender: "visionary",
          avatar: "",
        };
        let resArr = [userMessage]
        if (selectedBots.includes("contrarian")) {
          resArr.push(contrarianMessage)
        }
        if (selectedBots.includes("visionary")) {
          resArr.push(supporterMessage)
        }
        setMessages([
          ...messages,
          ...resArr
        ]);

        console.log("Contrarian Raw:", contrarianRaw);
        console.log("Visionary Raw:", visionaryRaw);
      }
    } catch (error) {
      console.error("Error fetching responses:", error);
    } finally {
      setNewMessage("");
      setLoading(false);
    }
  };
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-slate-950">
      <div className="flex flex-col  w-1/2 h-screen p-4 ">
        <header className="w-full flex items-center justify-center p-4 mb-4 rounded-full bg-slate-900">
          <h1 className="text-white text-2xl italic">The Board</h1>
        </header>
        <div className="flex flex-col p-4 border-2 mb-4 rounded-lg">
          <h2 className="text-lg font-bold mb-2">Group Chat</h2>
          <div className="flex flex-col overflow-y-scroll max-h-[500px]">
            {/* {isLoading && } */}
            {messages.map((message) => (
              <div
                className={`flex mb-2 ${
                  message.sender == username ? "justify-end" : ""
                }`}
              >
                {message.sender == username ? (
                  <div className=" bg-white p-2 rounded-lg">
                    <p className="text-sm text-slate-950 font-bold">
                      {message.sender}
                    </p>
                    <p className="text-sm text-slate-950">{message.text}</p>
                  </div>
                ) : (
                  <div className="flex">
                    <Avatar className="text-white mr-2 border-white border-2 rounded-full">
                      <AvatarImage src={message.avatar} />
                      <AvatarFallback>{message.sender[0]}</AvatarFallback>
                    </Avatar>
                    <div className="p-2 bg-slate-800 rounded-lg">
                      <p className="text-sm text-white font-bold">
                        {message.sender}
                      </p>
                      <p className="text-sm text-white">{message.text}</p>
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
            selectedChatbots={selectedBots}
            setChatbots={setChatbots}
          />
          {loading && <p className="text-white">Loading...</p>}
        </div>
        <div className="flex rounded">
          <Input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            className="w-full mr-2 border-2 text-white"
          />
          <Button
            className="text-white border-2 border-solid border-white"
            onClick={handleSendMessage}
            onKeyDown={(e) => {
                if (e.key === "Return") {
                    handleSendMessage();
                }
            }}
          >
            Send
          </Button>
        </div>
        {/* <ModeToggle /> */}
      </div>
    </div>
  );
};

export default ChatInterface;
