import { Link, useLocation } from "react-router-dom";
import {
  Home,
  BarChart2,
  Bot,
  User,
  Wallet,
  Download,
  History,
  Settings,
  HelpCircle,
  LogOut,
  Medal,
  Users,
  MoreHorizontal,
  Banknote,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useUser } from "@/context/UserContext";

const SideNav = () => {
  const location = useLocation();
  const { balance } = useUser();
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const navItems = [
    { path: "/dashboard", icon: <Home className="h-5 w-5" />, label: "Dashboard" },
    { path: "/deposit", icon: <Wallet className="h-5 w-5" />, label: "Deposit" },
    { path: "/withdraw", icon: <Download className="h-5 w-5" />, label: "Withdraw" },
    { path: "/trade", icon: <BarChart2 className="h-5 w-5" />, label: "Trade" },
    { path: "/bots", icon: <Bot className="h-5 w-5" />, label: "Bots" },
    { path: "/chart", icon: <Medal className="h-5 w-5" />, label: "Chart" },
    { path: "/affiliate", icon: <Users className="h-5 w-5" />, label: "Affiliate" },
    { path: "/demo", icon: <Banknote className="h-5 w-5" />, label: "Demo" },
    { path: "/transactions", icon: <History className="h-5 w-5" />, label: "Transactions" },
    { path: "/profile", icon: <User className="h-5 w-5" />, label: "Profile" },
    { path: "/more", icon: <MoreHorizontal className="h-5 w-5" />, label: "More" },
    { path: "/settings", icon: <Settings className="h-5 w-5" />, label: "Settings" },
  ];

  return (
    <div className="flex flex-col h-full bg-card">
      <div className="p-6 border-b border-accent/10">
        <h1 className="text-2xl font-bold text-primary mb-1">Vertex Trading</h1>
        <div className="text-sm text-muted-foreground">
          Current Balance: <span className="font-medium text-foreground">${balance.toFixed(2)}</span>
        </div>
      </div>
      
      <div className="py-4 flex-1">
        <nav className="space-y-1 px-2">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-md transition-colors",
                isActive(item.path)
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-accent/5 hover:text-foreground"
              )}
            >
              {item.icon}
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>
      </div>
      
      <div className="mt-auto p-4 border-t border-accent/10">
        <div className="space-y-2">
          <Button variant="ghost" className="w-full justify-start">
            <HelpCircle className="mr-2 h-5 w-5" />
            Help & Support
          </Button>
          <Button variant="ghost" className="w-full justify-start text-error">
            <LogOut className="mr-2 h-5 w-5" />
            Logout
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SideNav;
