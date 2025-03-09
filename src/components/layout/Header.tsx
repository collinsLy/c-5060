
import { Menu, Bell, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useUser } from "@/context/UserContext";
import SideNav from "./SideNav";

interface HeaderProps {
  title: string;
}

const Header: React.FC<HeaderProps> = ({ title }) => {
  const { username } = useUser();

  return (
    <header className="bg-card/50 backdrop-blur-sm border-b border-accent/10 sticky top-0 z-30">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="bg-card p-0">
              <SideNav />
            </SheetContent>
          </Sheet>
          <h1 className="text-xl font-bold">{title}</h1>
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon">
            <Bell className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon">
            <Settings className="h-5 w-5" />
          </Button>
          <div className="ml-2 hidden sm:block">
            <div className="text-sm font-medium">{username}</div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
