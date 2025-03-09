
import { Home, BarChart2, Bot, User } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";

const BottomNav = () => {
  const location = useLocation();
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-card border-t border-accent/10 py-2 md:hidden z-50">
      <div className="flex justify-around items-center">
        <Link
          to="/dashboard"
          className={cn(
            "flex flex-col items-center p-2 rounded-md transition-colors",
            isActive("/dashboard") 
              ? "text-primary" 
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          <Home className="h-5 w-5" />
          <span className="text-xs mt-1">Home</span>
        </Link>
        
        <Link
          to="/trade"
          className={cn(
            "flex flex-col items-center p-2 rounded-md transition-colors",
            isActive("/trade") 
              ? "text-primary" 
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          <BarChart2 className="h-5 w-5" />
          <span className="text-xs mt-1">Trade</span>
        </Link>
        
        <Link
          to="/bots"
          className={cn(
            "flex flex-col items-center p-2 rounded-md transition-colors",
            isActive("/bots") 
              ? "text-primary" 
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          <Bot className="h-5 w-5" />
          <span className="text-xs mt-1">Bots</span>
        </Link>
        
        <Link
          to="/profile"
          className={cn(
            "flex flex-col items-center p-2 rounded-md transition-colors",
            isActive("/profile") 
              ? "text-primary" 
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          <User className="h-5 w-5" />
          <span className="text-xs mt-1">Profile</span>
        </Link>
      </div>
    </div>
  );
};

export default BottomNav;
