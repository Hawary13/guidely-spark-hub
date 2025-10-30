import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useFastAuth } from "@/hooks/useFastAuth";
import { useAdminCache, useCacheStats } from "@/hooks/useAdminCache";
import { 
  Home, 
  Layout, 
  FileText, 
  Target, 
  Trophy, 
  Calendar, 
  Users, 
  Handshake, 
  BarChart3, 
  Newspaper,
  Eye,
  LogOut,
  Shield,
  Moon,
  Sun,
  Download,
  CheckCircle,
  AlertCircle
} from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect } from "react";

interface CleanAdminLayoutProps {
  children: React.ReactNode;
}

const navigation = [
  { 
    name: "Dashboard", 
    href: "/admin", 
    icon: Home,
    exact: true
  },
  { 
    name: "Hero Section", 
    href: "/admin/hero", 
    icon: Layout,
    description: "Homepage banner content"
  },
  { 
    name: "About Section", 
    href: "/admin/about", 
    icon: FileText,
    description: "About us content"
  },
  { 
    name: "Mission & Vision", 
    href: "/admin/mission", 
    icon: Target,
    description: "Core values and goals"
  },
  { 
    name: "UN SDGs", 
    href: "/admin/un-sdgs", 
    icon: Target,
    description: "Sustainable Development Goals"
  },
  { 
    name: "Programs", 
    href: "/admin/programs", 
    icon: Trophy,
    description: "Foundation programs"
  },
  { 
    name: "Projects", 
    href: "/admin/projects", 
    icon: Target,
    description: "Impact projects"
  },
  { 
    name: "Events", 
    href: "/admin/events", 
    icon: Calendar,
    description: "Upcoming events"
  },
  { 
    name: "Team", 
    href: "/admin/team", 
    icon: Users,
    description: "Team members"
  },
  { 
    name: "Partners", 
    href: "/admin/partners", 
    icon: Handshake,
    description: "Partner organizations"
  },
  { 
    name: "Success Stories", 
    href: "/admin/success-stories", 
    icon: BarChart3,
    description: "Impact stories"
  },
  { 
    name: "News", 
    href: "/admin/news", 
    icon: Newspaper,
    description: "Latest news"
  },
  { 
    name: "Statistics", 
    href: "/admin/statistics", 
    icon: BarChart3,
    description: "Impact metrics"
  },
  { 
    name: "User Management", 
    href: "/admin/users", 
    icon: Users,
    description: "Manage admin accounts"
  }
];

export function CleanAdminLayout({ children }: CleanAdminLayoutProps) {
  const [location] = useLocation();
  const { user, logout } = useFastAuth();
  const { theme, setTheme } = useTheme();
  const { status, preloadAdminData, refreshCache } = useAdminCache();
  const cacheStats = useCacheStats();

  // Optional: Auto-preload can be disabled for faster initial load
  // useEffect(() => {
  //   if (user && !status.isComplete && !status.isLoading) {
  //     preloadAdminData();
  //   }
  // }, [user, preloadAdminData, status.isComplete, status.isLoading]);

  const handleLogout = async () => {
    await logout();
  };

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  const isActive = (href: string, exact?: boolean) => {
    if (exact) {
      return location === href;
    }
    return location.startsWith(href);
  };

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-slate-900">
      {/* Sidebar */}
      <div className="w-72 bg-blue-900 dark:bg-slate-800 flex flex-col shadow-lg">
        {/* Header */}
        <div className="p-6 border-b border-blue-800 dark:border-slate-700">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-700 dark:bg-slate-700 rounded-lg flex items-center justify-center">
              <Shield className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-white">GSF Admin</h1>
              <p className="text-sm text-blue-200 dark:text-slate-400">Content Management</p>
            </div>
          </div>
        </div>

        {/* User Info */}
        <div className="p-4 border-b border-blue-800 dark:border-slate-700">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-blue-700 dark:bg-slate-700 rounded-full flex items-center justify-center">
              <span className="text-sm font-medium text-white">
                {user?.name?.charAt(0) || user?.email?.charAt(0) || 'A'}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">
                {user?.name || user?.displayName || 'Administrator'}
              </p>
              <p className="text-xs text-blue-200 dark:text-slate-400 truncate">
                {user?.email || 'admin@gsf.org.eg'}
              </p>
            </div>
          </div>
          
          {/* Cache Controls */}
          <div className="mt-3">
            {status.isLoading && (
              <div className="p-2 bg-blue-800/50 dark:bg-slate-700/50 rounded-md">
                <div className="flex items-center space-x-2 mb-2">
                  <Download className="h-3 w-3 text-blue-200 animate-bounce" />
                  <span className="text-xs text-blue-200">Loading data...</span>
                </div>
                <Progress value={status.progress} className="h-1" />
              </div>
            )}
            
            {!status.isLoading && (
              <div className="flex items-center space-x-2">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={preloadAdminData}
                  className="h-6 px-2 text-xs text-blue-200 hover:text-white"
                >
                  <Download className="h-3 w-3 mr-1" />
                  Cache Data
                </Button>
                {status.isComplete && (
                  <span className="text-xs text-green-400">
                    ✓ {Math.round(cacheStats.cacheHitRate)}%
                  </span>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Navigation */}
        <ScrollArea className="flex-1 px-3 py-4">
          <nav className="space-y-1">
            {navigation.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href, item.exact);
              
              return (
                <Link key={item.name} href={item.href}>
                  <div
                    className={`group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors cursor-pointer ${
                      active
                        ? 'bg-blue-700 dark:bg-slate-700 text-white'
                        : 'text-blue-100 dark:text-slate-300 hover:text-white hover:bg-blue-800 dark:hover:bg-slate-700'
                    }`}
                  >
                    <Icon className={`mr-3 h-5 w-5 flex-shrink-0 ${
                      active ? 'text-white' : 'text-blue-200 dark:text-slate-400'
                    }`} />
                    <div className="flex-1">
                      <div className="text-sm">{item.name}</div>
                      {item.description && (
                        <div className={`text-xs mt-0.5 ${
                          active ? 'text-white/80' : 'text-blue-200 dark:text-slate-400'
                        }`}>
                          {item.description}
                        </div>
                      )}
                    </div>
                  </div>
                </Link>
              );
            })}
          </nav>
        </ScrollArea>

        {/* Footer Actions */}
        <div className="p-4 border-t border-blue-800 dark:border-slate-700 space-y-2">
          {/* View Website */}
          <Link href="/">
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-start text-blue-200 dark:text-slate-400 hover:text-white hover:bg-blue-800 dark:hover:bg-slate-700"
            >
              <Eye className="mr-2 h-4 w-4" />
              View Website
            </Button>
          </Link>

          {/* Theme Toggle */}
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleTheme}
            className="w-full justify-start text-blue-200 dark:text-slate-400 hover:text-white hover:bg-blue-800 dark:hover:bg-slate-700"
          >
            {theme === "dark" ? (
              <Sun className="mr-2 h-4 w-4" />
            ) : (
              <Moon className="mr-2 h-4 w-4" />
            )}
            {theme === "dark" ? "Light Mode" : "Dark Mode"}
          </Button>

          {/* Logout */}
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLogout}
            className="w-full justify-start text-blue-200 dark:text-slate-400 hover:text-white hover:bg-red-800 dark:hover:bg-red-900"
          >
            <LogOut className="mr-2 h-4 w-4" />
            Sign Out
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <main className="flex-1 overflow-auto">
          <div className="h-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}