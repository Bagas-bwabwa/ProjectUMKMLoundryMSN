import { cn } from "@/lib/utils.js";

export function CardContent({ className, ...props }) {
  return <div className={cn("p-3 pt-0", className)} {...props} />;
}

