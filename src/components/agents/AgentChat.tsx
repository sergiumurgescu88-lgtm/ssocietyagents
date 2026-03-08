import { useState, useRef, useEffect } from "react";
import { Send, Bot, User, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { streamAgentChat, saveConversationMessage } from "@/lib/agents-api";
import { useAuth } from "@/stores/auth-store";
import { toast } from "sonner";
import ReactMarkdown from "react-markdown";

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface Props {
  agentId: string;
  agentName: string;
  agentRole: string;
  projectTitle?: string;
  initialMessages?: Message[];
}

export function AgentChat({ agentId, agentName, agentRole, projectTitle, initialMessages = [] }: Props) {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    const text = input.trim();
    if (!text || isStreaming || !user) return;
    setInput("");

    const userMsg: Message = { role: "user", content: text };
    setMessages((prev) => [...prev, userMsg]);
    setIsStreaming(true);

    // Save user message
    saveConversationMessage({ agent_id: agentId, user_id: user.id, role: "user", content: text });

    let assistantContent = "";

    const upsertAssistant = (chunk: string) => {
      assistantContent += chunk;
      setMessages((prev) => {
        const last = prev[prev.length - 1];
        if (last?.role === "assistant") {
          return prev.map((m, i) =>
            i === prev.length - 1 ? { ...m, content: assistantContent } : m
          );
        }
        return [...prev, { role: "assistant", content: assistantContent }];
      });
    };

    await streamAgentChat({
      messages: [...messages, userMsg],
      agentRole,
      agentName,
      projectTitle,
      onDelta: upsertAssistant,
      onDone: () => {
        setIsStreaming(false);
        // Save assistant message
        if (assistantContent) {
          saveConversationMessage({
            agent_id: agentId,
            user_id: user.id,
            role: "assistant",
            content: assistantContent,
          });
        }
        inputRef.current?.focus();
      },
      onError: (error) => {
        setIsStreaming(false);
        toast.error(error);
      },
    });
  };

  return (
    <div className="flex h-[500px] flex-col rounded-xl border border-border bg-card shadow-card">
      {/* Header */}
      <div className="flex items-center gap-3 border-b border-border px-4 py-3">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg gradient-money">
          <Bot className="h-4 w-4 text-primary-foreground" />
        </div>
        <div>
          <p className="text-sm font-semibold">{agentName}</p>
          <p className="text-[10px] text-muted-foreground capitalize">{agentRole.replace("_", " ")}</p>
        </div>
        {isStreaming && (
          <span className="ml-auto flex items-center gap-1 text-xs text-primary">
            <Loader2 className="h-3 w-3 animate-spin" /> Scrie...
          </span>
        )}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && (
          <div className="flex h-full items-center justify-center">
            <div className="text-center">
              <Bot className="mx-auto h-10 w-10 text-muted-foreground" />
              <p className="mt-2 text-sm font-medium">Salut! Sunt {agentName}.</p>
              <p className="text-xs text-muted-foreground">Cum te pot ajuta?</p>
            </div>
          </div>
        )}
        {messages.map((msg, i) => (
          <div key={i} className={cn("flex gap-3", msg.role === "user" ? "justify-end" : "justify-start")}>
            {msg.role === "assistant" && (
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg gradient-money">
                <Bot className="h-3.5 w-3.5 text-primary-foreground" />
              </div>
            )}
            <div
              className={cn(
                "max-w-[80%] rounded-xl px-4 py-2.5 text-sm",
                msg.role === "user"
                  ? "gradient-money text-primary-foreground"
                  : "bg-secondary"
              )}
            >
              {msg.role === "assistant" ? (
                <div className="prose prose-sm dark:prose-invert max-w-none [&>p]:mb-2 [&>p:last-child]:mb-0">
                  <ReactMarkdown>{msg.content}</ReactMarkdown>
                </div>
              ) : (
                <p>{msg.content}</p>
              )}
            </div>
            {msg.role === "user" && (
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-secondary">
                <User className="h-3.5 w-3.5 text-muted-foreground" />
              </div>
            )}
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="border-t border-border p-3">
        <div className="flex gap-2">
          <input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSend()}
            placeholder={`Scrie un mesaj către ${agentName}...`}
            disabled={isStreaming}
            maxLength={2000}
            className="flex-1 rounded-lg border border-input bg-secondary px-3 py-2.5 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary disabled:opacity-50"
          />
          <button
            onClick={handleSend}
            disabled={isStreaming || !input.trim()}
            className="flex h-10 w-10 items-center justify-center rounded-lg gradient-money text-primary-foreground transition-opacity disabled:opacity-50"
          >
            <Send className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
