import { Skeleton } from "@/components/ui/skeleton";

export function SkeletonCard() {
  return (
    <div className="glass rounded-xl p-6 space-y-4">
      <Skeleton className="h-48 w-full rounded-lg bg-white/5" />
      <Skeleton className="h-6 w-3/4 bg-white/5" />
      <Skeleton className="h-4 w-full bg-white/5" />
      <Skeleton className="h-4 w-2/3 bg-white/5" />
      <div className="flex gap-2 pt-2">
        <Skeleton className="h-6 w-16 rounded-full bg-white/5" />
        <Skeleton className="h-6 w-16 rounded-full bg-white/5" />
        <Skeleton className="h-6 w-16 rounded-full bg-white/5" />
      </div>
    </div>
  );
}
