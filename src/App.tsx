
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import Bots from "./pages/Bots";
import Trade from "./pages/Trade";
import Profile from "./pages/Profile";
import Transactions from "./pages/Transactions";
import { UserProvider } from "./context/UserContext";
import Chart from "./pages/Chart";
import Affiliate from "./pages/Affiliate";
import Demo from "./pages/Demo";
import More from "./pages/More";
import Settings from "./pages/Settings";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <BrowserRouter>
        <UserProvider>
          <Toaster />
          <Sonner />
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/bots" element={<Bots />} />
            <Route path="/trade" element={<Trade />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/transactions" element={<Transactions />} />
            <Route path="/chart" element={<Chart />} />
            <Route path="/affiliate" element={<Affiliate />} />
            <Route path="/demo" element={<Demo />} />
            <Route path="/more" element={<More />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </UserProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
