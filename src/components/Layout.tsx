
import { useState, ReactNode } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { 
  Home, 
  Store, 
  Users, 
  LogOut, 
  ChevronLeft, 
  ChevronRight,
  Settings,
  User
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { UserRole } from "@/types";
import { cn } from "@/lib/utils";

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);

  // If no user is logged in, redirect to login page
  if (!user) {
    navigate("/login");
    return null;
  }

  // Navigation items based on user role
  const getNavItems = () => {
    switch (user.role) {
      case UserRole.ADMIN:
        return [
          { label: "Dashboard", path: "/admin", icon: Home },
          { label: "Stores", path: "/admin/stores", icon: Store },
          { label: "Users", path: "/admin/users", icon: Users },
        ];
      case UserRole.STORE_OWNER:
        return [
          { label: "Dashboard", path: "/store-owner", icon: Home },
          { label: "Settings", path: "/store-owner/settings", icon: Settings },
        ];
      case UserRole.NORMAL:
        return [
          { label: "Stores", path: "/stores", icon: Store },
          { label: "Profile", path: "/profile", icon: User },
        ];
      default:
        return [];
    }
  };

  const navItems = getNavItems();
  
  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div className={cn(
        "bg-sidebar text-sidebar-foreground h-full transition-all duration-300 flex flex-col",
        collapsed ? "w-16" : "w-64"
      )}>
        {/* Logo area */}
        <div className="p-4 border-b border-sidebar-border flex items-center justify-between">
          {!collapsed && (
            <div className="text-xl font-bold">Score-It</div>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setCollapsed(!collapsed)}
            className="text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
          >
            {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
          </Button>
        </div>
        
        {/* Navigation links */}
        <div className="flex-1 py-4">
          <ul className="space-y-1">
            {navItems.map((item) => (
              <li key={item.path}>
                <Link 
                  to={item.path} 
                  className={cn(
                    "flex items-center px-4 py-2 mx-2 rounded-md transition-colors",
                    location.pathname === item.path
                      ? "bg-sidebar-primary text-sidebar-primary-foreground"
                      : "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                  )}
                >
                  <item.icon size={20} className={collapsed ? "mx-auto" : "mr-3"} />
                  {!collapsed && <span>{item.label}</span>}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        
        {/* User info & logout */}
        <div className="p-4 border-t border-sidebar-border">
          {!collapsed && (
            <div className="mb-2 text-sm opacity-80">
              <div className="truncate">{user.name}</div>
              <div className="truncate text-xs opacity-70">{user.email}</div>
            </div>
          )}
          <Button
            variant="ghost"
            size={collapsed ? "icon" : "sm"}
            onClick={logout}
            className="w-full text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
          >
            {collapsed ? (
              <LogOut size={20} />
            ) : (
              <>
                <LogOut size={16} className="mr-2" />
                <span>Logout</span>
              </>
            )}
          </Button>
        </div>
      </div>
      
      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="h-16 border-b flex items-center px-6">
          <div className="flex-1">
            <h1 className="text-xl font-semibold">
              {navItems.find(item => item.path === location.pathname)?.label || "Score-It System"}
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">
              {UserRole[user.role]} account
            </span>
          </div>
        </header>
        
        {/* Page content */}
        <div className="flex-1 overflow-y-auto p-6">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Layout;
