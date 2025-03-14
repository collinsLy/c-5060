
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import Bots from "./pages/Bots";
import Trade from "./pages/Trade";
import Profile from "./pages/Profile";
import Transactions from "./pages/Transactions";
import { UserProvider, useUser } from "./context/UserContext";
import Chart from "./pages/Chart";
import Affiliate from "./pages/Affiliate";
import Demo from "./pages/Demo";
import More from "./pages/More";
import Settings from "./pages/Settings";
import Auth from "./pages/Auth";
import Deposit from "./pages/Deposit";
import Withdraw from "./pages/Withdraw";

// Create a new QueryClient with default settings
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { session, isLoading } = useUser();
  
  if (isLoading) {
    return <div className="flex h-screen items-center justify-center">Loading...</div>;
  }
  
  if (!session) {
    return <Navigate to="/auth" />;
  }
  
  return <>{children}</>;
};

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/auth" element={<Auth />} />
      
      <Route path="/dashboard" element={
        <ProtectedRoute>
          <Dashboard />
        </ProtectedRoute>
      } />
      <Route path="/bots" element={
        <ProtectedRoute>
          <Bots />
        </ProtectedRoute>
      } />
      <Route path="/trade" element={
        <ProtectedRoute>
          <Trade />
        </ProtectedRoute>
      } />
      <Route path="/profile" element={
        <ProtectedRoute>
          <Profile />
        </ProtectedRoute>
      } />
      <Route path="/transactions" element={
        <ProtectedRoute>
          <Transactions />
        </ProtectedRoute>
      } />
      <Route path="/chart" element={
        <ProtectedRoute>
          <Chart />
        </ProtectedRoute>
      } />
      <Route path="/affiliate" element={
        <ProtectedRoute>
          <Affiliate />
        </ProtectedRoute>
      } />
      <Route path="/demo" element={
        <ProtectedRoute>
          <Demo />
        </ProtectedRoute>
      } />
      <Route path="/more" element={
        <ProtectedRoute>
          <More />
        </ProtectedRoute>
      } />
      <Route path="/settings" element={
        <ProtectedRoute>
          <Settings />
        </ProtectedRoute>
      } />
      <Route path="/deposit" element={
        <ProtectedRoute>
          <Deposit />
        </ProtectedRoute>
      } />
      <Route path="/withdraw" element={
        <ProtectedRoute>
          <Withdraw />
        </ProtectedRoute>
      } />
    </Routes>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <BrowserRouter>
        <UserProvider>
          <Toaster />
          <Sonner />
          <AppRoutes />
        </UserProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
