import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { ListTodo, Loader2, Wand2 } from "lucide-react";
import { toast } from "sonner";
import { planTasks } from "@/lib/ai.functions";
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
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const Route = createFileRoute("/planner")({
  head: () => ({ meta: [{ title: "AI Task Planner" }, { name: "description", content: "Prioritized daily and weekly task plans." }] }),
  component: PlannerPage,
});

function PlannerPage() {
  const fn = useServerFn(planTasks);
  const [tasks, setTasks] = useState("");
  const [range, setRange] = useState<"day" | "week">("day");
  const mutation = useMutation({
    mutationFn: () => fn({ data: { tasks, range } }),
    onSuccess: () => {
      bumpStat("tasks");
      toast.success("Plan ready");
    },
    onError: (e: Error) => toast.error(e.message || "Failed to plan"),
  });

  const EXAMPLES = [
    "Finish Q3 report\nReview PR #482\nCall client about renewal\nPrep slides for Monday standup",
    "Draft project brief\n1:1 with direct report\nInbox zero\nDeep work: refactor auth module",
  ];

  return (
    <div>
      <PageHeader icon={ListTodo} title="AI Task Planner" description="Get a prioritized plan with time-blocking and time-management tips." />
      <Card className="transition-shadow hover:shadow-md">
        <CardContent className="space-y-4 pt-6">
          <Tabs value={range} onValueChange={(v) => setRange(v as "day" | "week")}>
            <TabsList>
              <TabsTrigger value="day">Today</TabsTrigger>
              <TabsTrigger value="week">This week</TabsTrigger>
            </TabsList>
          </Tabs>
          <ExamplePrompts
            examples={["Sample workday tasks", "Sample focus week"]}
            onPick={(label) => setTasks(label === "Sample workday tasks" ? EXAMPLES[0] : EXAMPLES[1])}
          />
          <div>
            <Label htmlFor="tasks">List your tasks (one per line)</Label>
            <Textarea
              id="tasks"
              placeholder={"Finish Q3 report\nReview PR #482\nCall client about renewal\nPrep slides for Monday standup"}
              value={tasks}
              onChange={(e) => setTasks(e.target.value)}
              rows={8}
              className="mt-1.5"
            />
          </div>
          <Button onClick={() => mutation.mutate()} disabled={mutation.isPending || tasks.trim().length < 5}>
            {mutation.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Wand2 className="mr-2 h-4 w-4" />}
            {mutation.isPending ? "Planning..." : `Plan my ${range}`}
          </Button>
        </CardContent>
      </Card>
      {mutation.isPending && <ThinkingSkeleton label="Prioritizing your tasks..." />}
      {!mutation.isPending && mutation.data && <ResultCard text={mutation.data.text} />}
      <Disclaimer />
    </div>
  );
}
