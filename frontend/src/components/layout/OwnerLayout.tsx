import { Outlet, Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";

export function OwnerLayout() {
  const location = useLocation();

  const links = [
    { to: "/owner", label: "Dashboard" },
    { to: "/owner/event-types", label: "Event Types" },
    { to: "/owner/availability", label: "Availability" },
  ];

  return (
    <div className="flex min-h-screen flex-col bg-background font-sans text-foreground">
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 max-w-screen-2xl items-center">
          <Link to="/" className="mr-6 flex items-center space-x-2">
            <span className="font-bold sm:inline-block">BookingApp Admin</span>
          </Link>
          <nav className="flex items-center space-x-6 text-sm font-medium">
            {links.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={cn(
                  "transition-colors hover:text-foreground/80",
                  location.pathname === link.to || location.pathname.startsWith(link.to + "/")
                    ? "text-foreground"
                    : "text-foreground/60"
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      </header>
      <main className="container flex-1 py-8">
        <Outlet />
      </main>
    </div>
  );
}
