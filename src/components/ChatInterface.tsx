import { useState, useRef, useEffect } from "react";
import { Send, Search, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";

interface ChatMessage {
  id: string;
  type: "user" | "system";
  content: string;
  timestamp: Date;
}

interface ChatInterfaceProps {
  onSearch: (query: string) => void;
  searchResults: any[];
  isLoading: boolean;
}

export const ChatInterface = ({ onSearch, searchResults, isLoading }: ChatInterfaceProps) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "1",
      type: "system",
      content: "Merhaba! Excel verilerinizde arama yapmak için bir şeyler yazın. Örneğin: 'n8n workflow', 'AI video', 'sosyal medya' gibi...",
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: "user",
      content: inputValue,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    onSearch(inputValue);
    setInputValue("");

    // Add system response after search
    setTimeout(() => {
      const systemMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: "system",
        content: `"${inputValue}" için ${searchResults.length} sonuç bulundu:`,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, systemMessage]);
    }, 500);
  };

  return (
    <div className="flex flex-col h-full bg-gradient-card backdrop-blur-lg rounded-xl border border-border/50 shadow-card">
      {/* Chat Header */}
      <div className="p-4 border-b border-border/50">
        <div className="flex items-center space-x-2">
          <Sparkles className="w-5 h-5 text-primary animate-glow-pulse" />
          <h2 className="text-lg font-semibold text-foreground">Excel Arama Asistanı</h2>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.type === "user" ? "justify-end" : "justify-start"} animate-fade-in`}
          >
            <div
              className={`max-w-[80%] p-3 rounded-lg ${
                message.type === "user"
                  ? "bg-gradient-primary text-primary-foreground"
                  : "bg-secondary/50 text-foreground border border-border/30"
              }`}
            >
              <p className="text-sm">{message.content}</p>
              <span className="text-xs opacity-70 mt-1 block">
                {message.timestamp.toLocaleTimeString("tr-TR", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </div>
          </div>
        ))}
        
        {isLoading && (
          <div className="flex justify-start animate-fade-in">
            <div className="bg-secondary/50 p-3 rounded-lg border border-border/30">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
                <div className="w-2 h-2 bg-primary rounded-full animate-pulse delay-100"></div>
                <div className="w-2 h-2 bg-primary rounded-full animate-pulse delay-200"></div>
                <span className="text-sm text-muted-foreground ml-2">Aranıyor...</span>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-border/50">
        <form onSubmit={handleSubmit} className="flex space-x-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Aramak istediğiniz terimi yazın..."
              className="pl-10 bg-input/50 border-border/50 focus:border-primary focus:ring-primary/20"
              disabled={isLoading}
            />
          </div>
          <Button
            type="submit"
            size="icon"
            className="bg-gradient-primary hover:bg-gradient-primary/90 border-none shadow-glow"
            disabled={!inputValue.trim() || isLoading}
          >
            <Send className="w-4 h-4" />
          </Button>
        </form>
      </div>
    </div>
  );
};