
import React, { createContext, useContext, useState, useEffect } from "react";
import { toast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

type TradeType = "STANDARD" | "MASTER" | "PRO" | "CUSTOM";
type Market = "RISE_FALL" | "EVEN_ODD";
type CryptoPair = "BTC/USD" | "ETH/USD" | "SOL/USD" | "BNB/USD";

export interface TradeHistory {
  id: string;
  timestamp: Date;
  pair: CryptoPair;
  market: Market;
  stake: number;
  profit: number;
  result: "WIN" | "LOSS";
  type: TradeType;
}

export interface Transaction {
  id: string;
  timestamp: Date;
  amount: number;
  type: "DEPOSIT" | "WITHDRAWAL";
  status: "COMPLETED" | "PENDING" | "FAILED";
  details?: string;
}

interface UserContextType {
  balance: number;
  setBalance: (balance: number) => void;
  tradeHistory: TradeHistory[];
  transactions: Transaction[];
  addTransaction: (transaction: Omit<Transaction, "id" | "timestamp">) => void;
  executeTrade: (
    pair: CryptoPair,
    market: Market,
    stake: number,
    duration: number,
    profit: number,
    type: TradeType
  ) => Promise<void>;
  username: string;
  setUsername: (username: string) => void;
  signOut: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ 
  children 
}) => {
  const [balance, setBalance] = useState<number>(0); // Initialize with 0 balance
  const [tradeHistory, setTradeHistory] = useState<TradeHistory[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [username, setUsername] = useState<string>("kellyhunch");
  const navigate = useNavigate();

  // Load data from localStorage on mount
  useEffect(() => {
    const savedBalance = localStorage.getItem("vertex_balance");
    const savedTradeHistory = localStorage.getItem("vertex_tradeHistory");
    const savedTransactions = localStorage.getItem("vertex_transactions");
    const savedUsername = localStorage.getItem("vertex_username");
    
    if (savedBalance) setBalance(Number(savedBalance));
    if (savedTradeHistory) setTradeHistory(JSON.parse(savedTradeHistory));
    if (savedTransactions) setTransactions(JSON.parse(savedTransactions));
    if (savedUsername) setUsername(savedUsername);
  }, []);

  // Save data to localStorage when it changes
  useEffect(() => {
    localStorage.setItem("vertex_balance", balance.toString());
    localStorage.setItem("vertex_tradeHistory", JSON.stringify(tradeHistory));
    localStorage.setItem("vertex_transactions", JSON.stringify(transactions));
    localStorage.setItem("vertex_username", username);
  }, [balance, tradeHistory, transactions, username]);

  const signOut = () => {
    // Clear user data
    localStorage.removeItem("vertex_balance");
    localStorage.removeItem("vertex_tradeHistory");
    localStorage.removeItem("vertex_transactions");
    localStorage.removeItem("vertex_username");
    
    // Reset state
    setBalance(0); // Reset to 0 instead of 1000
    setTradeHistory([]);
    setTransactions([]);
    setUsername("kellyhunch");
    
    // Navigate to landing page
    navigate("/");
    
    toast({
      title: "Signed Out",
      description: "You have been successfully signed out.",
    });
  };

  const validateTransaction = (transaction: Omit<Transaction, "id" | "timestamp">): boolean => {
    // Ensure amount is a valid number
    if (isNaN(transaction.amount) || transaction.amount <= 0) {
      toast({
        title: "Invalid Transaction",
        description: "Transaction amount must be greater than 0.",
        variant: "destructive",
      });
      return false;
    }

    // Format to 2 decimal places
    transaction.amount = parseFloat(transaction.amount.toFixed(2));

    // Prevent negative balances for withdrawals
    if (transaction.type === "WITHDRAWAL" && transaction.amount > balance) {
      toast({
        title: "Insufficient Funds",
        description: "You don't have enough funds to complete this withdrawal.",
        variant: "destructive",
      });
      return false;
    }

    return true;
  };

  const addTransaction = (transaction: Omit<Transaction, "id" | "timestamp">) => {
    // Validate transaction before processing
    if (transaction.status === "COMPLETED" && !validateTransaction(transaction)) {
      return;
    }

    const newTransaction = {
      ...transaction,
      id: `tx-${Date.now()}-${Math.random().toString(36).substring(7)}`,
      timestamp: new Date(),
    };

    setTransactions((prev) => [newTransaction, ...prev]);

    // Update balance if transaction is completed
    if (transaction.status === "COMPLETED") {
      if (transaction.type === "DEPOSIT") {
        setBalance((prev) => {
          const newBalance = prev + transaction.amount;
          return parseFloat(newBalance.toFixed(2)); // Ensure 2 decimal places
        });
        toast({
          title: "Deposit Successful",
          description: `$${transaction.amount.toFixed(2)} has been added to your account.`,
        });
      } else if (transaction.type === "WITHDRAWAL") {
        setBalance((prev) => {
          const newBalance = prev - transaction.amount;
          return parseFloat(newBalance.toFixed(2)); // Ensure 2 decimal places
        });
        toast({
          title: "Withdrawal Successful",
          description: `$${transaction.amount.toFixed(2)} has been withdrawn from your account.`,
        });
      }
    }
  };

  const executeTrade = async (
    pair: CryptoPair,
    market: Market,
    stake: number,
    duration: number,
    profit: number,
    type: TradeType
  ) => {
    // Format stake to 2 decimal places
    stake = parseFloat(stake.toFixed(2));

    // Check if user has enough balance
    if (stake > balance) {
      toast({
        title: "Insufficient Balance",
        description: "You don't have enough funds to place this trade.",
        variant: "destructive",
      });
      return;
    }

    // Deduct stake from balance
    setBalance((prev) => parseFloat((prev - stake).toFixed(2)));
    
    toast({
      title: "Trade Started",
      description: `Trading ${pair} with $${stake.toFixed(2)}`,
    });

    // Simulate trade execution with the given duration
    try {
      await new Promise((resolve) => setTimeout(resolve, duration * 1000));
      
      // Simulate trade result (win/loss) - 50% chance of winning for demo
      const isWin = Math.random() > 0.5;
      const profitAmount = isWin ? parseFloat((stake * profit / 100).toFixed(2)) : 0;
      
      // Create trade history entry
      const tradeResult: TradeHistory = {
        id: `trade-${Date.now()}-${Math.random().toString(36).substring(7)}`,
        timestamp: new Date(),
        pair,
        market,
        stake,
        profit: profitAmount,
        result: isWin ? "WIN" : "LOSS",
        type,
      };
      
      setTradeHistory((prev) => [tradeResult, ...prev]);
      
      // Update balance if win
      if (isWin) {
        setBalance((prev) => parseFloat((prev + stake + profitAmount).toFixed(2)));
        toast({
          title: "Trade Successful!",
          description: `You won $${profitAmount.toFixed(2)} on ${pair}!`,
          variant: "default",
        });
      } else {
        toast({
          title: "Trade Lost",
          description: `You lost $${stake.toFixed(2)} on ${pair}.`,
          variant: "default",
        });
      }
    } catch (error) {
      // Refund stake in case of error
      setBalance((prev) => parseFloat((prev + stake).toFixed(2)));
      toast({
        title: "Trade Error",
        description: "An error occurred while executing your trade.",
        variant: "destructive",
      });
    }
  };

  return (
    <UserContext.Provider
      value={{
        balance,
        setBalance,
        tradeHistory,
        transactions,
        addTransaction,
        executeTrade,
        username,
        setUsername,
        signOut
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
