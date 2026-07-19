import { cn } from "../../lib/cn.js";

const LEVELS = [
  { label: "Too weak", className: "bg-danger" },
  { label: "Weak", className: "bg-warning" },
  { label: "Good", className: "bg-warning" },
  { label: "Strong", className: "bg-success" },
];

function scorePassword(password) {
  if (!password) return 0;
  let score = 0;
  if (password.length >= 6) score += 1;
  if (password.length >= 10) score += 1;
  if (/[A-Z]/.test(password) && /[a-z]/.test(password)) score += 1;
  if (/[0-9]/.test(password) && /[^A-Za-z0-9]/.test(password)) score += 1;
  return Math.min(score, 4);
}

export default function PasswordStrength({ password }) {
  const score = scorePassword(password);
  const level = LEVELS[Math.max(score - 1, 0)];

  if (!password) return null;

  return (
    <div className="mt-2" aria-live="polite">
      <div className="flex gap-1.5">
        {[0, 1, 2, 3].map((i) => (
          <span
            key={i}
            className={cn(
              "h-1 flex-1 rounded-full bg-border transition-colors duration-300",
              i < score && level.className
            )}
          />
        ))}
      </div>
      <p className="mt-1.5 text-[13px] text-ink-muted">
        Password strength: <span className="font-medium text-ink">{level.label}</span>
      </p>
    </div>
  );
}
