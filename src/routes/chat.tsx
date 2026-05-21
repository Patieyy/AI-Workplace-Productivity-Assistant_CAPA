import { createFileRoute } from "@tanstack/react-router";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import { MessageSquare, Send, Loader2, Sparkles } from "lucide-react";
import { PageHeader } from "@/components/app/PageHeader";
import { Disclaimer } from "@/components/app/Disclaimer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

export const Route = createFileRoute("/chat")({
  head: () => ({ meta: [{ title: "AI Chat" }, { name: "description", content: "Chat with your AI productivity assistant." }] }),
  component: ChatPage,
});

const SUGGESTIONS = [
  "How do I run a great weekly 1:1?",
  "Suggest a focus routine for deep work afternoons.",
  "How do I say no to a meeting without offending my manager?",
  "Help me prep for a difficult performance conversation.",
];

function ChatPage() {
  const transport = new DefaultChatTransport({ api: "/api/chat" });
  const { messages, sendMessage, status } = useChat({
    transport,
    onError: (e) => toast.error(e.message || "Chat error"),
  });
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);
  const taRef = useRef<HTMLTextAreaElement>(null);

  const isLoading = status === "submitted" || status === "streaming";

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, status]);

  useEffect(() => {
    taRef.current?.focus();
  }, []);

  const submit = async () => {
    const text = input.trim();
    if (!text || isLoading) return;
    setInput("");
    await sendMessage({ text });
  };

  return (
    <div>
      <PageHeader icon={MessageSquare} title="AI Chat" description="Ask anything about workplace productivity, communication, and focus." />
      <Card className="flex h-[65vh] flex-col overflow-hidden">
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 md:p-6">
          {messages.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center text-center">
              <div
                className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl text-primary-foreground shadow-md"
                style={{ background: "var(--gradient-primary)" }}
              >
                <Sparkles className="h-6 w-6" />
              </div>
              <h3 className="text-base font-semibold">Start a conversation</h3>
              <p className="mt-1 text-sm text-muted-foreground">Try one of these to get started:</p>
              <div className="mt-4 grid w-full max-w-lg gap-2">
                {SUGGESTIONS.map((s) => (
                  <button
                    key={s}
                    onClick={() => sendMessage({ text: s })}
                    className="rounded-lg border bg-card px-3 py-2 text-left text-sm transition-colors hover:border-primary/40 hover:bg-accent/40"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {messages.map((m) => {
                const text = m.parts.map((p) => (p.type === "text" ? p.text : "")).join("");
                const isUser = m.role === "user";
                return (
                  <div key={m.id} className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
                    <div
                      className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm shadow-sm ${
                        isUser
                          ? "bg-primary text-primary-foreground"
                          : "border bg-card text-foreground"
                      }`}
                    >
                      {isUser ? (
                        <p className="whitespace-pre-wrap">{text}</p>
                      ) : (
                        <div className="prose prose-sm max-w-none prose-headings:font-semibold prose-p:my-2 prose-ul:my-2 prose-li:my-0.5">
                          <ReactMarkdown>{text}</ReactMarkdown>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
              {status === "submitted" && (
                <div className="flex justify-start">
                  <div className="rounded-2xl border bg-card px-4 py-2.5 text-sm text-muted-foreground">
                    <Loader2 className="inline h-3.5 w-3.5 animate-spin" /> Thinking...
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
        <div className="border-t bg-background/60 p-3 backdrop-blur">
          <div className="flex items-end gap-2">
            <Textarea
              ref={taRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  submit();
                }
              }}
              placeholder="Ask anything..."
              rows={1}
              className="min-h-[44px] resize-none"
              disabled={isLoading}
            />
            <Button onClick={submit} disabled={isLoading || !input.trim()} size="icon" className="h-11 w-11 shrink-0">
              {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
            </Button>
          </div>
        </div>
      </Card>
      <Disclaimer />
    </div>
  );
}
