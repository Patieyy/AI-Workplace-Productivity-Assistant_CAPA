import { Loader2, Sparkles } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function ThinkingSkeleton({ label = "Generating response..." }: { label?: string }) {
  return (
    <Card className="mt-6 animate-fade-in overflow-hidden">
      <CardContent className="pt-6">
        <div className="mb-4 flex items-center gap-2 text-xs font-medium text-primary">
          <span className="relative inline-flex h-5 w-5 items-center justify-center">
            <span className="absolute inset-0 animate-ping rounded-full bg-primary/30" />
            <Sparkles className="relative h-3.5 w-3.5" />
          </span>
          <Loader2 className="h-3.5 w-3.5 animate-spin" />
          <span>{label}</span>
        </div>
        <div className="space-y-2.5">
          <Skeleton className="h-3 w-3/4" />
          <Skeleton className="h-3 w-full" />
          <Skeleton className="h-3 w-5/6" />
          <Skeleton className="h-3 w-2/3" />
          <Skeleton className="h-3 w-11/12" />
        </div>
      </CardContent>
    </Card>
  );
}