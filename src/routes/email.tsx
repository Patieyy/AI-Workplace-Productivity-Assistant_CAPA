import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { Mail, Loader2, Wand2 } from "lucide-react";
import { toast } from "sonner";
import { generateEmail } from "@/lib/ai.functions";
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export const Route = createFileRoute("/email")({
  head: () => ({ meta: [{ title: "Smart Email Generator" }, { name: "description", content: "Generate professional emails." }] }),
  component: EmailPage,
});

function EmailPage() {
  const fn = useServerFn(generateEmail);
  const [purpose, setPurpose] = useState("");
  const [tone, setTone] = useState<"formal" | "friendly" | "persuasive">("formal");
  const [audience, setAudience] = useState<"manager" | "client" | "team member">("manager");

  const mutation = useMutation({
    mutationFn: () => fn({ data: { purpose, tone, audience } }),
    onSuccess: () => {
      bumpStat("emails");
      toast.success("Email drafted");
    },
    onError: (e: Error) => toast.error(e.message || "Failed to generate email"),
  });

  const EXAMPLES = [
    "Ask my manager for time off next Friday for a family event.",
    "Follow up with a client who hasn't responded to my proposal in a week.",
    "Decline a meeting invite politely and suggest async updates instead.",
    "Introduce myself to a new cross-functional team I'll collaborate with.",
  ];

  return (
    <div>
      <PageHeader icon={Mail} title="Smart Email Generator" description="Draft professional emails tailored to your tone and audience." />
      <Card className="transition-shadow hover:shadow-md">
        <CardContent className="space-y-4 pt-6">
          <ExamplePrompts examples={EXAMPLES} onPick={setPurpose} />
          <div>
            <Label htmlFor="purpose">What's the email about?</Label>
            <Textarea
              id="purpose"
              placeholder="e.g. Ask my manager for time off next Friday to attend a family event."
              value={purpose}
              onChange={(e) => setPurpose(e.target.value)}
              rows={4}
              className="mt-1.5"
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label>Tone</Label>
              <Select value={tone} onValueChange={(v) => setTone(v as typeof tone)}>
                <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="formal">Formal</SelectItem>
                  <SelectItem value="friendly">Friendly</SelectItem>
                  <SelectItem value="persuasive">Persuasive</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Audience</Label>
              <Select value={audience} onValueChange={(v) => setAudience(v as typeof audience)}>
                <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="manager">Manager</SelectItem>
                  <SelectItem value="client">Client</SelectItem>
                  <SelectItem value="team member">Team member</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <Button
            onClick={() => mutation.mutate()}
            disabled={mutation.isPending || purpose.trim().length < 3}
            className="w-full sm:w-auto"
          >
            {mutation.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Wand2 className="mr-2 h-4 w-4" />}
            {mutation.isPending ? "Drafting..." : "Generate email"}
          </Button>
        </CardContent>
      </Card>
      {mutation.isPending && <ThinkingSkeleton label="Drafting your email..." />}
      {!mutation.isPending && mutation.data && <ResultCard text={mutation.data.text} />}
      <Disclaimer />
    </div>
  );
}
