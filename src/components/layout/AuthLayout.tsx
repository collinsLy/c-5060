
import { ReactNode } from "react";
import Header from "./Header";
import BottomNav from "./BottomNav";
import SideNav from "./SideNav";

interface AuthLayoutProps {
  children: ReactNode;
  title: string;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ children, title }) => {
  return (
    <div className="flex min-h-screen bg-background">
      <div className="hidden md:block w-64 fixed inset-y-0 z-50">
        <SideNav />
      </div>
      
      <div className="flex-1 md:ml-64">
        <Header title={title} />
        
        <main className="container mx-auto px-4 py-6 pb-20 md:pb-6">
          {children}
        </main>
        
        <BottomNav />
      </div>
    </div>
  );
};

export default AuthLayout;
