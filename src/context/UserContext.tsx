
import React from "react";
import { AuthProvider, useAuth } from "./AuthContext";
import { FinanceProvider, useFinance } from "./FinanceContext";
import { TradeProvider, useTrade } from "./TradeContext";

// Re-export types for compatibility
export type { Transaction } from "./FinanceContext";
export type { TradeHistory, TradeType, Market, CryptoPair } from "./TradeContext";

// Combined provider for all user-related contexts
export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ 
  children 
}) => {
  return (
    <AuthProvider>
      <FinanceProvider>
        <TradeProvider>
          {children}
        </TradeProvider>
      </FinanceProvider>
    </AuthProvider>
  );
};

// Combined hook for accessing all user-related contexts
export const useUser = () => {
  const auth = useAuth();
  const finance = useFinance();
  const trade = useTrade();

  return {
    // Auth context
    session: auth.session,
    user: auth.user,
    isLoading: auth.isLoading,
    username: auth.username,
    setUsername: auth.setUsername,
    signOut: auth.signOut,
    
    // Finance context
    balance: finance.balance,
    setBalance: finance.setBalance,
    transactions: finance.transactions,
    addTransaction: finance.addTransaction,
    
    // Trade context
    tradeHistory: trade.tradeHistory,
    executeTrade: trade.executeTrade
  };
};
