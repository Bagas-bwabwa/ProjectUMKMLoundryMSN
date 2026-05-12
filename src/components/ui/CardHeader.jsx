import { cn } from "@/lib/utils.js";

export function CardHeader({ className, ...props }) {
  return (
    <div className={cn("flex flex-col space-y-1.5 p-3", className)} {...props} />
  );
}

