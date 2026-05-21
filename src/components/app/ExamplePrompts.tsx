import { Sparkles } from "lucide-react";

export function ExamplePrompts({
  examples,
  onPick,
}: {
  examples: string[];
  onPick: (value: string) => void;
}) {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
        <Sparkles className="h-3.5 w-3.5 text-primary" />
        Try an example
      </div>
      <div className="flex flex-wrap gap-2">
        {examples.map((ex) => (
          <button
            key={ex}
            type="button"
            onClick={() => onPick(ex)}
            className="rounded-full border bg-card px-3 py-1.5 text-xs text-foreground/80 transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:bg-accent/40 hover:text-foreground hover:shadow-sm"
          >
            {ex}
          </button>
        ))}
      </div>
    </div>
  );
}