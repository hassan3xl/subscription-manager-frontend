"use client";
import { ThemeSwitcher } from "@/providers/theme-switcher";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "../ui/button";
import { User, LogOut, Sparkles, Menu, X, MenuIcon } from "lucide-react";
import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { useModal } from "@/providers/ModalProvider";
import AdminManageModal from "../modals/AdminManageModal";
import UserManageModal from "../modals/UserManageModal";

export function Navbar() {
  const { user, loading, signOut } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { openModal } = useModal();

  const handleaAdminMenuOpen = () => {
    openModal(<AdminManageModal />);
  };
  const handleUserMenuOpen = () => {
    openModal(<UserManageModal />);
  };
  return (
    <nav className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-lg border-b border-border/40 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex gap-4">
            {user?.role === "admin" ? (
              <MenuIcon onClick={handleaAdminMenuOpen} />
            ) : (
              <MenuIcon onClick={handleUserMenuOpen} />
            )}

            <Link href="/" className="flex items-center gap-2 group">
              <div className="relative">
                <Sparkles className="h-6 w-6 text-primary group-hover:rotate-12 transition-transform duration-300" />
                <div className="absolute inset-0 bg-primary/20 blur-xl group-hover:bg-primary/30 transition-colors" />
              </div>
              <span className="text-xl font-bold bg-primary bg-clip-text text-transparent">
                Subscription Manager
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-3">
            <ThemeSwitcher />

            {!loading && (
              <>
                {user ? (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="outline"
                        className="gap-2 hover:bg-accent"
                      >
                        <span className="font-medium">
                          {user.name?.split(" ")[0] || "Account"}
                        </span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56">
                      <DropdownMenuLabel className="font-normal">
                        <div className="flex flex-col space-y-1">
                          <p className="text-sm font-medium leading-none">
                            {user.name || "User"}
                          </p>
                          <p className="text-xs leading-none text-muted-foreground">
                            {user.email}
                          </p>
                        </div>
                      </DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild>
                        <Link
                          href="/account"
                          className="cursor-pointer flex items-center gap-2"
                        >
                          <User className="h-4 w-4" />
                          Account Settings
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={signOut}
                        className="cursor-pointer text-destructive focus:text-destructive flex items-center gap-2"
                      >
                        <LogOut className="h-4 w-4" />
                        Sign Out
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                ) : (
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      asChild
                      className="hover:bg-accent"
                    >
                      <Link href="/sign-in">Sign In</Link>
                    </Button>
                  </div>
                )}
              </>
            )}

            {loading && (
              <div className="h-9 w-24 bg-accent/50 rounded-md animate-pulse" />
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-2">
            <ThemeSwitcher />
            <Button
              variant="outline"
              size="icon"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-border/40 bg-background/95 backdrop-blur-lg animate-in slide-in-from-top-2 duration-200">
          <div className="px-4 py-4 space-y-3">
            {!loading && (
              <>
                {user ? (
                  <>
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-accent/50">
                      <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center text-primary-foreground font-semibold">
                        {user.name?.charAt(0).toUpperCase() || "U"}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-sm">
                          {user.name || "User"}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {user.email}
                        </p>
                      </div>
                    </div>
                    <Button className="w-full justify-start gap-2" asChild>
                      <Link
                        href="/account"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        <User className="h-4 w-4" />
                        Account Settings
                      </Link>
                    </Button>
                    <Button
                      className="w-full justify-start gap-2 text-destructive hover:text-destructive"
                      onClick={() => {
                        signOut();
                        setMobileMenuOpen(false);
                      }}
                    >
                      <LogOut className="h-4 w-4" />
                      Sign Out
                    </Button>
                  </>
                ) : (
                  <>
                    <Button className="w-full" asChild>
                      <Link
                        href="/sign-in"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        Sign In
                      </Link>
                    </Button>
                  </>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
