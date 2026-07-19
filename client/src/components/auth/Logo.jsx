import { TerminalSquare } from "lucide-react";
import { cn } from "../../lib/cn.js";

export default function Logo({ tone = "default", className }) {
  const isOnDark = tone === "onDark";

  return (
    <div className={cn("inline-flex items-center gap-2", className)}>
      <span
        className={cn(
          "flex h-8 w-8 items-center justify-center rounded-lg",
          isOnDark ? "bg-panel-ink/10 text-panel-ink" : "bg-ink text-surface"
        )}
      >
        <TerminalSquare className="h-[18px] w-[18px]" strokeWidth={2} aria-hidden="true" />
      </span>
      <span
        className={cn(
          "font-mono text-[15px] font-semibold tracking-tight",
          isOnDark ? "text-panel-ink" : "text-ink"
        )}
      >
        DevWorkspaceLab
      </span>
    </div>
  );
}
