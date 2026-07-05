import { Link, NavLink, useLocation } from "react-router-dom";
import clsx from "clsx";
import type { ComponentType, SVGProps } from "react";
import {
  AcademicCapIcon,
  ArrowUpTrayIcon,
  ChartBarIcon,
  DocumentPlusIcon,
  PhotoIcon,
  ShieldCheckIcon,
  Squares2X2Icon,
  UsersIcon,
} from "@heroicons/react/24/outline";

interface NavItem {
  label: string;
  to?: string;
  icon: ComponentType<SVGProps<SVGSVGElement>>;
  isActive?: (pathname: string) => boolean;
}

const navItems: NavItem[] = [
  {
    label: "Dashboard",
    to: "/dashboard",
    icon: Squares2X2Icon,
    isActive: (pathname) => pathname === "/dashboard",
  },
  {
    label: "Test Creation",
    to: "/tests/new",
    icon: DocumentPlusIcon,
    isActive: (pathname) => pathname.startsWith("/tests"),
  },
  { label: "Test Tracking", icon: ChartBarIcon },
  { label: "Roles and permissions", icon: ShieldCheckIcon },
  { label: "User Management", icon: UsersIcon },
  { label: "Student Management", icon: AcademicCapIcon },
  { label: "Bulk Upload", icon: ArrowUpTrayIcon },
  { label: "Banner Management", icon: PhotoIcon },
];

interface SidebarContentProps {
  onNavigate?: () => void;
}

function SidebarContent({ onNavigate }: SidebarContentProps) {
  const { pathname } = useLocation();

  return (
    <>
      <div className="flex h-16 items-center border-b border-border px-6">
        <Link to="/dashboard" onClick={onNavigate}>
          <img
            src="/logo.png"
            alt="PrepRoute"
            className="h-8 w-auto object-contain"
          />
        </Link>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-4" aria-label="Main navigation">
        <ul className="space-y-1">
          {navItems.map((item) => {
            const active = item.isActive?.(pathname) ?? false;
            const Icon = item.icon;

            if (!item.to) {
              return (
                <li key={item.label}>
                  <span
                    className="flex cursor-default items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground/60"
                    aria-disabled="true"
                  >
                    <Icon className="h-5 w-5 shrink-0" aria-hidden="true" />
                    {item.label}
                  </span>
                </li>
              );
            }

            return (
              <li key={item.label}>
                <NavLink
                  to={item.to}
                  onClick={onNavigate}
                  className={clsx(
                    "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                    active
                      ? "border-l-4 border-primary bg-primary/10 pl-2 text-primary"
                      : "border-l-4 border-transparent text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                >
                  <Icon
                    className={clsx(
                      "h-5 w-5 shrink-0",
                      active ? "text-primary" : "text-muted-foreground/60"
                    )}
                    aria-hidden="true"
                  />
                  {item.label}
                </NavLink>
              </li>
            );
          })}
        </ul>
      </nav>
    </>
  );
}

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export default function Sidebar({ isOpen = false, onClose }: SidebarProps) {
  return (
    <>
      {isOpen && (
        <button
          type="button"
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          aria-label="Close navigation menu"
          onClick={onClose}
        />
      )}

      <aside
        className={clsx(
          "fixed inset-y-0 left-0 z-50 flex w-60 flex-col border-r border-border bg-card transition-transform duration-300 ease-in-out lg:hidden",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <SidebarContent onNavigate={onClose} />
      </aside>

      <aside className="fixed inset-y-0 left-0 z-40 hidden w-60 flex-col border-r border-border bg-card lg:flex">
        <SidebarContent />
      </aside>
    </>
  );
}
