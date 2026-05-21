import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { Lightbulb, Loader2, Wand2 } from "lucide-react";
import { toast } from "sonner";
import { researchTopic } from "@/lib/ai.functions";
import { PageHeader } from "@/components/app/PageHeader";
import { ResultCard } from "@/components/app/ResultCard";
import { Disclaimer } from "@/components/app/Disclaimer";
import { ExamplePrompts } from "@/components/app/ExamplePrompts";
import { ThinkingSkeleton } from "@/components/app/ThinkingSkeleton";
import { bumpStat } from "@/hooks/use-stats";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export const Route = createFileRoute("/research")({
  head: () => ({ meta: [{ title: "AI Research Assistant" }, { name: "description", content: "Summarize topics and surface key insights." }] }),
  component: ResearchPage,
});

function ResearchPage() {
  const fn = useServerFn(researchTopic);
  const [topic, setTopic] = useState("");
  const mutation = useMutation({
    mutationFn: () => fn({ data: { topic } }),
    onSuccess: () => {
      bumpStat("research");
      toast.success("Briefing ready");
    },
    onError: (e: Error) => toast.error(e.message || "Failed to research"),
  });

  const EXAMPLES = [
    "Impact of remote work on engineering team productivity",
    "Best practices for async communication across time zones",
    "How leading SaaS companies structure onboarding",
    "Trends in AI-assisted knowledge work for 2026",
  ];

  return (
    <div>
      <PageHeader icon={Lightbulb} title="AI Research Assistant" description="Summarize a topic or pasted text and surface insights and recommendations." />
      <Card className="transition-shadow hover:shadow-md">
        <CardContent className="space-y-4 pt-6">
          <ExamplePrompts examples={EXAMPLES} onPick={setTopic} />
          <div>
            <Label htmlFor="topic">Topic or source text</Label>
            <Textarea
              id="topic"
              placeholder="e.g. 'Impact of remote work on engineering team productivity' or paste an article..."
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              rows={8}
              className="mt-1.5"
            />
          </div>
          <Button onClick={() => mutation.mutate()} disabled={mutation.isPending || topic.trim().length < 3}>
            {mutation.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Wand2 className="mr-2 h-4 w-4" />}
            {mutation.isPending ? "Researching..." : "Generate briefing"}
          </Button>
        </CardContent>
      </Card>
      {mutation.isPending && <ThinkingSkeleton label="Researching the topic..." />}
      {!mutation.isPending && mutation.data && <ResultCard text={mutation.data.text} />}
      <Disclaimer />
    </div>
  );
}
