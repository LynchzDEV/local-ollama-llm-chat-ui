import { useState } from "react";
import ollamaService from "./services/ollamaService";

const ChatApp = () => {
  const [messages, setMessages] = useState<string[]>([]);
  const [prompt, setPrompt] = useState("");

  const handleSendMessage = async () => {
    if (!prompt.trim()) return;

    try {
      const userMessage = `User: ${prompt}`;
      setMessages((prev) => [...prev, userMessage]);

      const response = await ollamaService.getCompletion(prompt);
      const botMessage = `Bot: ${response}`;
      setMessages((prev) => [...prev, botMessage]);

      setPrompt("");
    } catch (error) {
      console.error("Error:", error);
      setMessages((prev) => [
        ...prev,
        "Bot: An error occurred while generating a response.",
      ]);
    }
  };

  return (
    <div className="min-h-screen bg-base-200 p-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-center text-2xl font-bold mb-8">Chat App</h1>

        <div className="bg-base-100 rounded-lg shadow-lg p-6 h-[80vh] flex flex-col">
          <div className="flex-1 overflow-y-auto mb-4 space-y-2">
            {messages.map((msg, index) => {
              const isUser = msg.startsWith("User:");
              return (
                <div
                  key={index}
                  className={`chat ${isUser ? "chat-end" : "chat-start"}`}
                >
                  <div
                    className={`chat-bubble ${isUser ? "chat-bubble-primary" : "chat-bubble-secondary"}`}
                  >
                    <span className="font-semibold">
                      {isUser ? "You:" : "Bot:"}
                    </span>
                    <span className="ml-1">
                      {msg.replace(/^User: |^Bot: /, "")}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex gap-2">
            <input
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
              placeholder="Type your message..."
              className="input input-bordered flex-1"
            />
            <button onClick={handleSendMessage} className="btn btn-primary">
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatApp;
