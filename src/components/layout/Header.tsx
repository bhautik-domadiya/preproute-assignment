import { useAuthStore } from "@/store/auth.store";
import {
  ArrowPathIcon,
  Bars3Icon,
  ChevronDownIcon,
} from "@heroicons/react/24/outline";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

interface HeaderProps {
  onMenuClick?: () => void;
}

export default function Header({ onMenuClick }: HeaderProps) {
  const navigate = useNavigate();
  const logout = useAuthStore((s) => s.logout);
  const user = useAuthStore((s) => s.user);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleLogout = async () => {
    if (isLoggingOut) return;

    setIsLoggingOut(true);
    try {
      logout();
      navigate("/");
    } finally {
      setIsLoggingOut(false);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };

    if (showDropdown) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showDropdown]);

  return (
    <header className="fixed inset-x-0 top-0 z-30 flex h-16 items-center justify-between border-b border-border bg-card px-4 sm:px-6 lg:left-60 lg:justify-end">
      <div className="flex items-center gap-3 lg:hidden">
        <button
          type="button"
          onClick={onMenuClick}
          className="cursor-pointer rounded-lg p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          aria-label="Open navigation menu"
        >
          <Bars3Icon className="h-6 w-6" aria-hidden="true" />
        </button>

        <img
          src="/logo.png"
          alt="PrepRoute"
          className="h-7 w-auto object-contain"
        />
      </div>

      <div className="flex items-center gap-3 sm:gap-5">
        <div className="relative" ref={dropdownRef}>
          <button
            type="button"
            onClick={() => setShowDropdown(!showDropdown)}
            className="flex cursor-pointer items-center gap-3 rounded-lg py-2 pr-2 pl-3 transition-colors hover:bg-muted sm:pl-5"
          >
            <img
              src="/profile_avatar.png"
              alt={user?.name ?? "User"}
              className="h-9 w-9 rounded-full object-cover"
            />

            <div className="hidden min-w-0 text-left sm:block">
              <p className="truncate text-sm font-semibold text-foreground">
                {user?.name ?? "User"}
              </p>
              <p className="truncate text-xs capitalize text-muted-foreground">
                {user?.role ?? "Admin"}
              </p>
            </div>

            <ChevronDownIcon
              className={`h-4 w-4 text-muted-foreground transition-transform ${
                showDropdown ? "rotate-180" : ""
              }`}
              aria-hidden="true"
            />
          </button>

          {showDropdown && (
            <div className="absolute right-0 z-50 mt-2 w-48 rounded-lg bg-card shadow-lg ring-1 ring-border focus:outline-none">
                <button
                  type="button"
                  onClick={handleLogout}
                  disabled={isLoggingOut}
                  className="flex w-full cursor-pointer items-center gap-2 px-4 py-2 text-sm text-foreground hover:bg-muted disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isLoggingOut && (
                    <ArrowPathIcon className="h-4 w-4 animate-spin" aria-hidden="true" />
                  )}
                  {isLoggingOut ? "Logging out..." : "Logout"}
                </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
