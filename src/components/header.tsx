import Link from "next/link";
import { site } from "@/config";
import type { SessionUser } from "@/lib/auth";
import { logout } from "@/app/login/actions";

export function Header({ user }: { user: SessionUser | null }) {
  return (
    <header className="sticky top-0 z-20 border-b border-line/70 bg-bg/80 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-5xl items-center gap-4 px-4">
        <Link href={user ? "/topics" : "/"} className="text-lg font-extrabold tracking-tight">
          <span className="text-gradient">{site.name}</span>
        </Link>
        <nav className="ml-auto flex items-center gap-1 text-sm font-semibold sm:gap-2">
          {user ? (
            <>
              <NavLink href="/topics">Mavzular</NavLink>
              {user.role === "admin" && <NavLink href="/admin">Admin</NavLink>}
              <NavLink href="/settings">Sozlamalar</NavLink>
              <form action={logout}>
                <button className="rounded-md px-2.5 py-1.5 text-muted hover:bg-surface-2 hover:text-fg">
                  Chiqish
                </button>
              </form>
            </>
          ) : (
            <Link
              href="/login"
              className="rounded-md bg-surface-2 px-3 py-1.5 text-fg ring-1 ring-line hover:ring-line-strong"
            >
              Kirish
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link href={href} className="rounded-md px-2.5 py-1.5 text-muted hover:bg-surface-2 hover:text-fg">
      {children}
    </Link>
  );
}
