import Link from "next/link";

type TopNavLinksProps = {
  currentPath: string;
};

const navItems = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/materials", label: "Materials" },
  { href: "/scan", label: "Scan" },
  { href: "/jobs", label: "Jobs" },
  { href: "/reports", label: "Reports" },
];

export function TopNavLinks({ currentPath }: TopNavLinksProps) {
  return (
    <div className="flex flex-wrap gap-2">
      <Link
        href="/"
        className="rounded-xl border border-slate-700 px-3 py-1.5 text-xs font-semibold text-slate-200 transition hover:bg-slate-900"
      >
        Home
      </Link>

      {navItems.map((item) => {
        const isActive =
          item.href === currentPath ||
          (item.href === "/materials" && currentPath.startsWith("/materials/"));

        return (
          <Link
            key={item.href}
            href={item.href}
            className={`rounded-xl border px-3 py-1.5 text-xs font-semibold transition ${
              isActive
                ? "border-amber-500/70 bg-amber-500/10 text-amber-300"
                : "border-slate-700 text-slate-200 hover:bg-slate-900"
            }`}
          >
            {item.label}
          </Link>
        );
      })}
    </div>
  );
}
