import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useTheme } from "@/contexts/ThemeContext";
import { useAuth } from "@/hooks/useAuth";
import { useSidebar } from "@/contexts/SidebarContext";
import { SearchBar } from "@/components/Search/SearchBar";
import { Moon, Sun, User, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import logoImage from "@assets/logo-design_1751134726547.jpg";

export function Navigation() {
  const { theme, toggleTheme } = useTheme();
  const { user, isAuthenticated } = useAuth();
  const { toggleSidebar } = useSidebar();
  const [, setLocation] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-700 z-50">
        <div className="w-full">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              {/* Single Hamburger Menu Button */}
              <div className="pl-4">
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-10 w-10 p-0 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full"
                  onClick={() => {
                    // On desktop and tablet, toggle sidebar; on mobile, toggle mobile menu
                    if (window.innerWidth >= 768) {
                      toggleSidebar();
                    } else {
                      setMobileMenuOpen(!mobileMenuOpen);
                    }
                  }}
                  title="Menu"
                >
                  {mobileMenuOpen && window.innerWidth < 768 ? (
                    <X className="h-6 w-6" />
                  ) : (
                    <Menu className="h-6 w-6" />
                  )}
                </Button>
              </div>

              {/* Logo */}
              <Link href="/" className="flex items-center space-x-2">
                <img
                  src={logoImage}
                  alt="Rhythmic Souls AI Logo"
                  className="w-8 h-8 sm:w-10 sm:h-10 rounded-full object-cover"
                />
                <div className="hidden sm:block">
                  <h1 className="text-lg sm:text-xl font-bold bg-gradient-to-r from-purple-500 to-blue-500 bg-clip-text text-transparent">
                    Rhythmic Souls AI
                  </h1>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Intelligent Business Solutions
                  </p>
                </div>
                <div className="block sm:hidden">
                  <h1 className="text-sm font-bold bg-gradient-to-r from-purple-500 to-blue-500 bg-clip-text text-transparent">
                    Rhythmic Souls
                  </h1>
                </div>
              </Link>
            </div>

            {/* Navigation Items */}
            <div className="hidden md:flex items-center space-x-8">
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

            {/* Right Side Actions */}
            <div className="flex items-center space-x-4 pr-4 sm:pr-6 lg:pr-8">
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
                  onClick={() => setLocation("/auth")}
                  className="bg-gradient-to-r from-purple-500 to-blue-500 text-white hover:from-purple-600 hover:to-blue-600 transition-all"
                >
                  <User className="h-4 w-4 mr-2" />
                  <span className="hidden sm:block">Sign In</span>
                </Button>
              )}


            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay - Only show on mobile screens */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 md:hidden">
          <div className="fixed left-0 top-0 bottom-0 w-64 bg-white dark:bg-slate-900 transform transition-transform duration-300 shadow-lg">
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
              <div className="mt-6 px-3 lg:hidden">
                <SearchBar />
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
