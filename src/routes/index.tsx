import { createFileRoute, Link } from "@tanstack/react-router";
import { Mail, NotebookPen, ListTodo, Lightbulb, MessageSquare, Sparkles, ArrowRight, TrendingUp } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useStats } from "@/hooks/use-stats";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "AI Workplace Productivity Assistant" },
      { name: "description", content: "Automate emails, summarize meetings, plan tasks, and research faster with AI." },
    ],
  }),
  component: Dashboard,
});

const features = [
  { to: "/email", icon: Mail, title: "Smart Email Generator", desc: "Draft professional emails by purpose, tone, and audience." },
  { to: "/meetings", icon: NotebookPen, title: "Meeting Summarizer", desc: "Turn raw notes into decisions, action items, and owners." },
  { to: "/planner", icon: ListTodo, title: "AI Task Planner", desc: "Prioritized daily or weekly plans with time-blocking." },
  { to: "/research", icon: Lightbulb, title: "Research Assistant", desc: "Summarize topics and surface key insights instantly." },
  { to: "/chat", icon: MessageSquare, title: "Productivity Chat", desc: "Ask anything about workflows, focus, and communication." },
];

function Dashboard() {
  const stats = useStats();
  const analytics = [
    { label: "Emails Generated", value: stats.emails, icon: Mail, accent: "from-indigo-500/15 to-violet-500/10" },
    { label: "Tasks Planned", value: stats.tasks, icon: ListTodo, accent: "from-violet-500/15 to-fuchsia-500/10" },
    { label: "Meetings Summarized", value: stats.meetings, icon: NotebookPen, accent: "from-blue-500/15 to-indigo-500/10" },
  ];
  return (
    <div className="animate-fade-in">
      <section
        className="relative overflow-hidden rounded-2xl border p-6 sm:p-8 md:p-12"
        style={{ background: "var(--gradient-subtle)" }}
      >
        <div
          className="absolute -right-20 -top-20 h-64 w-64 rounded-full opacity-30 blur-3xl"
          style={{ background: "var(--gradient-primary)" }}
        />
        <div className="relative">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border bg-background/60 px-3 py-1 text-xs font-medium text-muted-foreground backdrop-blur">
            <Sparkles className="h-3.5 w-3.5 text-primary" />
            Powered by Lovable AI
          </div>
          <h1 className="max-w-2xl text-3xl font-semibold tracking-tight md:text-4xl">
            Your AI co-pilot for the modern workplace.
          </h1>
          <p className="mt-3 max-w-xl text-sm text-muted-foreground md:text-base">
            Automate routine work — emails, meeting notes, task planning, and research — so you can focus on what actually matters.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Button asChild size="lg">
              <Link to="/email">
                Try Email Generator <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link to="/chat">Open AI Chat</Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="mt-8">
        <div className="mb-4 flex items-center gap-2">
          <TrendingUp className="h-4 w-4 text-primary" />
          <h2 className="text-lg font-semibold tracking-tight">Your activity</h2>
        </div>
        <div className="grid gap-4 sm:grid-cols-3">
          {analytics.map((a) => (
            <Card
              key={a.label}
              className="group relative overflow-hidden transition-all hover:-translate-y-0.5 hover:shadow-lg"
            >
              <div
                className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${a.accent} opacity-60`}
              />
              <CardContent className="relative p-5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    {a.label}
                  </span>
                  <div
                    className="flex h-8 w-8 items-center justify-center rounded-lg text-primary-foreground shadow-sm transition-transform group-hover:scale-110"
                    style={{ background: "var(--gradient-primary)" }}
                  >
                    <a.icon className="h-4 w-4" />
                  </div>
                </div>
                <div className="mt-3 text-3xl font-semibold tracking-tight">{a.value}</div>
                <p className="mt-1 text-xs text-muted-foreground">
                  {a.value === 0 ? "No activity yet — try a tool below." : "Total this device"}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="mt-8">
        <h2 className="mb-4 text-lg font-semibold tracking-tight">Tools</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f) => (
            <Link key={f.to} to={f.to} className="group">
              <Card className="h-full transition-all duration-200 hover:-translate-y-1 hover:border-primary/40 hover:shadow-lg">
                <CardContent className="p-5">
                  <div
                    className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg text-primary-foreground shadow-sm transition-transform group-hover:scale-110"
                    style={{ background: "var(--gradient-primary)" }}
                  >
                    <f.icon className="h-5 w-5" />
                  </div>
                  <h3 className="text-base font-semibold">{f.title}</h3>
                  <p className="mt-1.5 text-sm text-muted-foreground">{f.desc}</p>
                  <div className="mt-4 inline-flex items-center text-xs font-medium text-primary">
                    Open <ArrowRight className="ml-1 h-3 w-3 transition-transform group-hover:translate-x-0.5" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
