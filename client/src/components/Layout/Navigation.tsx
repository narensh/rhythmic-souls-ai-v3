import { useState } from "react";
import { Link } from "wouter";
import { useTheme } from "@/contexts/ThemeContext";
import { useAuth } from "@/hooks/useAuth";
import { useSidebar } from "@/contexts/SidebarContext";
import { SearchBar } from "@/components/Search/SearchBar";
import { Moon, Sun, User, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

export function Navigation() {
  const { theme, toggleTheme } = useTheme();
  const { user, isAuthenticated } = useAuth();
  const { toggleSidebar } = useSidebar();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-700 z-50">
        <div className="w-full px-4">
          <div className="flex items-center justify-between h-16">
            {/* Left: Hamburger Menu */}
            <Button
              variant="ghost"
              size="sm"
              className="h-10 w-10 p-0 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full"
              onClick={toggleSidebar}
              title="Main menu"
            >
              <Menu className="h-6 w-6" />
            </Button>

            {/* Center: Logo and Title */}
            <Link href="/" className="flex items-center space-x-3 absolute left-1/2 transform -translate-x-1/2">
              <img
                src="/logo.jpg"
                alt="Rhythmic Souls AI Logo"
                className="w-10 h-10 rounded-full object-cover"
              />
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-purple-500 to-blue-500 bg-clip-text text-transparent">
                  Rhythmic Souls AI
                </h1>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Intelligent Business Solutions
                </p>
              </div>
            </Link>

            {/* Right: Navigation Items & Actions */}
            <div className="flex items-center space-x-4">
              {/* Navigation Items */}
              <div className="hidden md:flex items-center space-x-6">
                <a
                  href="#services"
                  className="text-slate-600 dark:text-slate-300 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
                >
                  Services
                </a>
                <a
                  href="#solutions"
                  className="text-slate-600 dark:text-slate-300 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
                >
                  Solutions
                </a>
                <a
                  href="#resources"
                  className="text-slate-600 dark:text-slate-300 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
                >
                  Resources
                </a>
                <a
                  href="#about"
                  className="text-slate-600 dark:text-slate-300 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
                >
                  About
                </a>
              </div>
              
              {/* Search */}
              <div className="hidden lg:block">
                <SearchBar />
              </div>

              {/* Theme Toggle */}
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleTheme}
                className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
              >
                {theme === "dark" ? (
                  <Sun className="h-4 w-4" />
                ) : (
                  <Moon className="h-4 w-4" />
                )}
              </Button>

              {/* User Menu */}
              {isAuthenticated ? (
                <div className="flex items-center space-x-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={(user as any)?.profileImageUrl} />
                    <AvatarFallback className="bg-gradient-to-br from-purple-500 to-blue-500 text-white">
                      {(user as any)?.firstName?.[0] ||
                        (user as any)?.email?.[0] ||
                        "U"}
                    </AvatarFallback>
                  </Avatar>
                  <Button
                    variant="ghost"
                    onClick={() => (window.location.href = "/api/logout")}
                    className="hidden sm:block text-sm"
                  >
                    Logout
                  </Button>
                </div>
              ) : (
                <Button
                  onClick={() => (window.location.href = "/api/login")}
                  className="bg-gradient-to-r from-purple-500 to-blue-500 text-white hover:from-purple-600 hover:to-blue-600 transition-all"
                >
                  <User className="h-4 w-4 mr-2" />
                  <span className="hidden sm:block">Sign In</span>
                </Button>
              )}

              {/* Mobile Menu Button */}
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? (
                  <X className="h-4 w-4" />
                ) : (
                  <Menu className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 lg:hidden">
          <div className="fixed left-0 top-0 bottom-0 w-64 bg-white dark:bg-slate-900 transform transition-transform duration-300">
            <div className="p-4">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold">Menu</h3>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <nav className="space-y-3">
                <a
                  href="#services"
                  className="block px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Services
                </a>
                <a
                  href="#solutions"
                  className="block px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Solutions
                </a>
                <a
                  href="#resources"
                  className="block px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Resources
                </a>
                <a
                  href="#about"
                  className="block px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  About
                </a>
              </nav>
              <div className="mt-6 lg:hidden">
                <SearchBar />
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
