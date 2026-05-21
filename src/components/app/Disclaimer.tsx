import { Info } from "lucide-react";
export function Disclaimer() {
  return (
    <div className="mt-6 flex items-start gap-2 rounded-lg border bg-muted/40 p-3 text-xs text-muted-foreground">
      <Info className="mt-0.5 h-3.5 w-3.5 shrink-0" />
      <span>AI-generated content may require human review.</span>
    </div>
  );
}
