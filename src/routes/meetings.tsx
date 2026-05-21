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
    onError: (e: Error) => toast.error(e.message || "Failed to summarize"),
  });

  return (
    <div>
      <PageHeader icon={NotebookPen} title="Meeting Notes Summarizer" description="Extract decisions, action items, deadlines, and owners from raw notes." />
      <Card>
        <CardContent className="space-y-4 pt-6">
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
      {mutation.data && <ResultCard text={mutation.data.text} />}
      <Disclaimer />
    </div>
  );
}
