import { useState, useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { solarizedlight } from "react-syntax-highlighter/dist/esm/styles/prism";
import ollamaService from "./services/ollamaService";

const ChatApp = () => {
  const [messages, setMessages] = useState<string[]>([]);
  const [prompt, setPrompt] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!prompt.trim()) return;

    try {
      const userMessage = `User: ${prompt}`;
      setMessages((prev) => [...prev, userMessage]);
      setPrompt("");
      setIsTyping(true);

      const response = await ollamaService.getCompletion(prompt);
      setIsTyping(false);

      const botMessage = `Bot: ${response}`;
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error("Error:", error);
      setIsTyping(false);
      setMessages((prev) => [
        ...prev,
        "Bot: An error occurred while generating a response.",
      ]);
    }
  };

  const parseMessage = (msg: string) => {
    return msg.split(/<think>(.*?)<\/think>/gs).map((part, index) => {
      if (index % 2 === 1 && part.trim().length > 0) {
        return (
          <details
            key={index}
            className="collapse bg-base-300 rounded-lg p-2 text-neutral-content"
          >
            <summary className="cursor-pointer font-semibold">
              Show Thinking Process.
            </summary>
            <div className="mt-2 p-2 bg-base-100 rounded-lg">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  h1: ({ ...props }) => (
                    <h1 className="text-4xl font-bold" {...props} />
                  ),
                  h2: ({ ...props }) => (
                    <h2 className="text-3xl font-bold" {...props} />
                  ),
                  h3: ({ ...props }) => (
                    <h3 className="text-2xl font-bold" {...props} />
                  ),
                  code({ className, children, ...props }) {
                    const match = /language-(\w+)/.exec(className || "");
                    return match ? (
                      <SyntaxHighlighter
                        style={solarizedlight}
                        language={match[1]}
                        PreTag="div"
                        {...props}
                      >
                        {String(children).replace(/\n$/, "")}
                      </SyntaxHighlighter>
                    ) : (
                      <code className={className} {...props}>
                        {children}
                      </code>
                    );
                  },
                }}
              >
                {part}
              </ReactMarkdown>
            </div>
          </details>
        );
      }
      return (
        <ReactMarkdown
          key={index}
          remarkPlugins={[remarkGfm]}
          components={{
            h1: ({ ...props }) => (
              <h1 className="text-4xl font-bold" {...props} />
            ),
            h2: ({ ...props }) => (
              <h2 className="text-3xl font-bold" {...props} />
            ),
            h3: ({ ...props }) => (
              <h3 className="text-2xl font-bold" {...props} />
            ),
            code({ className, children, ...props }) {
              const match = /language-(\w+)/.exec(className || "");
              return match ? (
                <SyntaxHighlighter
                  style={solarizedlight}
                  language={match[1]}
                  PreTag="div"
                  {...props}
                >
                  {String(children).replace(/\n$/, "")}
                </SyntaxHighlighter>
              ) : (
                <code className={className} {...props}>
                  {children}
                </code>
              );
            },
          }}
        >
          {part}
        </ReactMarkdown>
      );
    });
  };

  return (
    <div className="min-h-screen bg-base-300 p-4">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-center text-2xl font-bold mb-8">Yo Chat!</h1>

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
                    className={`chat-bubble ${
                      isUser ? "chat-bubble-primary" : "chat-bubble-secondary"
                    }`}
                  >
                    <span className="font-semibold">
                      {isUser ? "You:" : "Bot:"}
                    </span>
                    <span className="ml-1">
                      {parseMessage(msg.replace(/^User: |^Bot: /, ""))}
                    </span>
                  </div>
                </div>
              );
            })}
            {isTyping && (
              <div className="chat chat-start">
                <div className="chat-bubble chat-bubble-secondary">
                  <span className="font-semibold">Bot:</span>
                  <span className="ml-1 animate-pulse">
                    bro aint thinker 💀...
                  </span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
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
