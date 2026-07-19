import Logo from "./Logo.jsx";

const TERMINAL_LINES = [
  { prompt: "$", text: "devlab init workspace", delay: "animate-delay-1" },
  { prompt: "", text: "✓ Provisioning container…", delay: "animate-delay-2", muted: true },
  { prompt: "", text: "✓ Attaching AI pair programmer…", delay: "animate-delay-3", muted: true },
  { prompt: "$", text: "devlab auth login", delay: "animate-delay-4" },
];

const FEATURES = [
  "Cloud dev environments that boot in seconds",
  "An AI pair programmer wired into every repo",
  "One workspace, from first commit to production",
];

/**
 * Two-column shell shared by Login and Register: a dark brand panel on
 * the left (hidden on small screens) and the auth card on the right.
 *
 * Props:
 * - eyebrow: small label above the heading (e.g. "Welcome back")
 * - title / description: page heading + supporting copy
 * - children: the form itself
 * - footer: node rendered under the card (e.g. the "Register" link)
 */
export default function AuthLayout({ eyebrow, title, description, children, footer }) {
  return (
    <div className="flex min-h-screen flex-col bg-surface lg:flex-row">
      <aside className="relative hidden overflow-hidden bg-panel px-12 py-10 lg:flex lg:w-[44%] lg:flex-col lg:justify-between xl:px-16">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage:
              "linear-gradient(rgb(var(--color-panel-ink)) 1px, transparent 1px), linear-gradient(90deg, rgb(var(--color-panel-ink)) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
          aria-hidden="true"
        />

        <div className="relative animate-fade-up">
          <Logo tone="onDark" />
        </div>

        <div className="relative animate-fade-up animate-delay-1">
          <h2 className="max-w-sm text-[28px] font-semibold leading-[1.25] tracking-tight text-panel-ink xl:text-[32px]">
            Ship code with an AI teammate that never leaves the terminal.
          </h2>

          <ul className="mt-8 space-y-3">
            {FEATURES.map((feature) => (
              <li key={feature} className="flex items-start gap-2.5 text-[14.5px] text-panel-ink/70">
                <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-panel-ink/40" aria-hidden="true" />
                {feature}
              </li>
            ))}
          </ul>

          <div className="mt-10 overflow-hidden rounded-xl border border-panel-ink/10 bg-black/20 shadow-inset-line animate-fade-up animate-delay-2">
            <div className="flex items-center gap-1.5 border-b border-panel-ink/10 px-4 py-2.5">
              <span className="h-2.5 w-2.5 rounded-full bg-panel-ink/20" />
              <span className="h-2.5 w-2.5 rounded-full bg-panel-ink/20" />
              <span className="h-2.5 w-2.5 rounded-full bg-panel-ink/20" />
              <span className="ml-2 font-mono text-[11px] text-panel-ink/40">workspace — zsh</span>
            </div>
            <div className="space-y-1.5 px-4 py-4 font-mono text-[13px] leading-relaxed">
              {TERMINAL_LINES.map((line, i) => (
                <p key={i} className={`animate-fade-in ${line.delay} ${line.muted ? "text-panel-ink/40" : "text-panel-ink/90"}`}>
                  {line.prompt && <span className="mr-2 text-panel-ink/40">{line.prompt}</span>}
                  {line.text}
                  {i === TERMINAL_LINES.length - 1 && (
                    <span className="ml-0.5 inline-block h-[13px] w-[7px] translate-y-[2px] animate-blink bg-panel-ink/70" />
                  )}
                </p>
              ))}
            </div>
          </div>
        </div>

        <p className="relative text-xs text-panel-ink/40">© {new Date().getFullYear()} DevWorkspaceLab. All rights reserved.</p>
      </aside>

      <main className="flex flex-1 items-center justify-center px-6 py-12 sm:px-10 lg:px-12">
        <div className="w-full max-w-[420px] animate-fade-up">
          <div className="mb-8 flex justify-center lg:hidden">
            <Logo />
          </div>

          <div className="rounded-2xl border border-border bg-surface-raised p-7 shadow-card transition-shadow duration-300 hover:shadow-card-hover sm:p-9">
            <div className="mb-7">
              {eyebrow && (
                <p className="mb-2 font-mono text-[12px] font-medium uppercase tracking-wider text-ink-faint">
                  {eyebrow}
                </p>
              )}
              <h1 className="text-2xl font-semibold tracking-tight text-ink">{title}</h1>
              {description && <p className="mt-1.5 text-[14.5px] text-ink-muted">{description}</p>}
            </div>

            {children}
          </div>

          {footer && <div className="mt-6 text-center text-[14.5px] text-ink-muted">{footer}</div>}
        </div>
      </main>
    </div>
  );
}
