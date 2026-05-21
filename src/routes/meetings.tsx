import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { NotebookPen, Loader2, Wand2 } from "lucide-react";
import { toast } from "sonner";
import { summarizeMeeting } from "@/lib/ai.functions";
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

export const Route = createFileRoute("/meetings")({
  head: () => ({ meta: [{ title: "Meeting Notes Summarizer" }, { name: "description", content: "Summarize meetings into key points and action items." }] }),
  component: MeetingsPage,
});

function MeetingsPage() {
  const fn = useServerFn(summarizeMeeting);
  const [notes, setNotes] = useState("");
  const mutation = useMutation({
    mutationFn: () => fn({ data: { notes } }),
    onSuccess: () => {
      bumpStat("meetings");
      toast.success("Meeting summarized");
    },
    onError: (e: Error) => toast.error(e.message || "Failed to summarize"),
  });

  const SAMPLE = `Weekly product sync — Tue 10am
Attendees: Alex (PM), Sam (Eng), Priya (Design), Jordan (Marketing)
- Alex: launch slipped to next Thursday; need final QA pass by Tue EOD.
- Sam: backend ready; one open bug on Safari email rendering.
- Priya: new onboarding screens delivered, awaiting copy from Jordan.
- Jordan: will send copy by Wed noon; planning launch email Thu 9am.
Decisions: ship behind feature flag; rollout 10% -> 50% -> 100% over 3 days.
Next steps: Sam fixes Safari bug, Priya updates Figma, Jordan owns launch comms.`;

  return (
    <div>
      <PageHeader icon={NotebookPen} title="Meeting Notes Summarizer" description="Extract decisions, action items, deadlines, and owners from raw notes." />
      <Card className="transition-shadow hover:shadow-md">
        <CardContent className="space-y-4 pt-6">
          <ExamplePrompts examples={["Load a sample meeting transcript"]} onPick={() => setNotes(SAMPLE)} />
          <div>
            <Label htmlFor="notes">Paste your meeting notes or transcript</Label>
            <Textarea
              id="notes"
              placeholder="Paste raw notes here..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={10}
              className="mt-1.5 font-mono text-xs"
            />
          </div>
          <Button onClick={() => mutation.mutate()} disabled={mutation.isPending || notes.trim().length < 20}>
            {mutation.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Wand2 className="mr-2 h-4 w-4" />}
            {mutation.isPending ? "Summarizing..." : "Summarize meeting"}
          </Button>
        </CardContent>
      </Card>
      {mutation.isPending && <ThinkingSkeleton label="Summarizing meeting notes..." />}
      {!mutation.isPending && mutation.data && <ResultCard text={mutation.data.text} />}
      <Disclaimer />
    </div>
  );
}
