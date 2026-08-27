import { Link, useRouterState } from "@tanstack/react-router";
import { FileStack, Hammer, Library, Plus, UserRound } from "lucide-react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { useDesk } from "@/lib/store";

const NAV = [
  { to: "/", label: "Desk", icon: FileStack },
  { to: "/library", label: "Library", icon: Library },
  { to: "/templates", label: "Templates", icon: Hammer },
  { to: "/profile", label: "Profile", icon: UserRound },
  { to: "/new", label: "New posting", icon: Plus },
] as const;

export function Shell({ children }: { children: React.ReactNode }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const markHydrated = useDesk((s) => s.markHydrated);
  const hydrated = useDesk((s) => s.hydrated);
  const [ready, setReady] = useState(hydrated);

  useEffect(() => {
    const unsub = useDesk.persist.onFinishHydration(() => {
      markHydrated();
      setReady(true);
    });
    if (useDesk.persist.hasHydrated()) {
      markHydrated();
      setReady(true);
    }
    return unsub;
  }, [markHydrated]);

  return (
    <div className="min-h-dvh bg-bg text-fg">
      <header className="sticky top-0 z-30 border-b border-border bg-bg/90 backdrop-blur-sm no-print">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
          <Link to="/" className="flex items-baseline gap-2 no-underline">
            <span className="font-display text-xl font-medium tracking-tight">
              Apply Desk
            </span>
            <span className="hidden text-xs text-muted sm:inline">
              One packet at a time
            </span>
          </Link>
          <nav className="flex items-center gap-1">
            {NAV.map((item) => {
              const active =
                item.to === "/"
                  ? pathname === "/"
                  : pathname.startsWith(item.to);
              const Icon = item.icon;
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  aria-label={item.label}
                  className={cn(
                    "inline-flex h-11 items-center gap-2 rounded-[var(--radius-sm)] px-3 text-sm no-underline transition-colors duration-150",
                    active ? "bg-bg-subtle text-fg" : "text-muted hover:text-fg",
                  )}
                >
                  <Icon className="size-4" />
                  <span className="hidden sm:inline">{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>
      </header>
      <main className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 sm:py-10">
        {ready ? children : <LoadingBlock />}
      </main>
    </div>
  );
}

function LoadingBlock() {
  return (
    <div className="space-y-4">
      <div className="h-10 w-48 rounded-[var(--radius-md)] bg-bg-subtle" />
      <div className="h-40 rounded-[var(--radius-xl)] bg-bg-subtle" />
    </div>
  );
}
