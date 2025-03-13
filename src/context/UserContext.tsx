import React, { createContext, useContext, useState, useEffect } from "react";
import { toast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Session, User } from "@supabase/supabase-js";

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
  session: Session | null;
  user: User | null;
  isLoading: boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ 
  children 
}) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [balance, setBalance] = useState<number>(0);
  const [tradeHistory, setTradeHistory] = useState<TradeHistory[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [username, setUsername] = useState<string>("");
  const navigate = useNavigate();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, currentSession) => {
        setIsLoading(true);
        setSession(currentSession);
        setUser(currentSession?.user ?? null);
        
        if (currentSession?.user) {
          await loadUserData(currentSession.user.id);
        } else {
          resetUserData();
        }
        
        setIsLoading(false);
      }
    );

    const initializeAuth = async () => {
      const { data: { session: initialSession } } = await supabase.auth.getSession();
      setSession(initialSession);
      setUser(initialSession?.user ?? null);
      
      if (initialSession?.user) {
        await loadUserData(initialSession.user.id);
      } else {
        resetUserData();
      }
      
      setIsLoading(false);
    };

    initializeAuth();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const loadUserData = async (userId: string) => {
    try {
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('username, balance')
        .eq('id', userId)
        .single();

      if (profileError) throw profileError;
      
      if (profileData) {
        setUsername(profileData.username || "");
        setBalance(profileData.balance || 0);
      }

      const { data: tradeData, error: tradeError } = await supabase
        .from('trade_history')
        .select('*')
        .eq('user_id', userId)
        .order('timestamp', { ascending: false });

      if (tradeError) throw tradeError;
      
      if (tradeData) {
        setTradeHistory(tradeData.map(trade => ({
          id: trade.id,
          timestamp: new Date(trade.timestamp),
          pair: trade.pair as CryptoPair,
          market: trade.market as Market,
          stake: trade.stake,
          profit: trade.profit,
          result: trade.result as "WIN" | "LOSS",
          type: trade.type as TradeType
        })));
      }

      const { data: transactionData, error: transactionError } = await supabase
        .from('transactions')
        .select('*')
        .eq('user_id', userId)
        .order('timestamp', { ascending: false });

      if (transactionError) throw transactionError;
      
      if (transactionData) {
        setTransactions(transactionData.map(transaction => ({
          id: transaction.id,
          timestamp: new Date(transaction.timestamp),
          amount: transaction.amount,
          type: transaction.type as "DEPOSIT" | "WITHDRAWAL",
          status: transaction.status as "COMPLETED" | "PENDING" | "FAILED",
          details: transaction.details
        })));
      }
    } catch (error: any) {
      console.error("Error loading user data:", error.message);
      toast({
        title: "Error",
        description: "Failed to load user data. Please try refreshing the page.",
        variant: "destructive",
      });
    }
  };

  const resetUserData = () => {
    setBalance(0);
    setTradeHistory([]);
    setTransactions([]);
    setUsername("");
  };

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      resetUserData();
      navigate("/");
      
      toast({
        title: "Signed Out",
        description: "You have been successfully signed out.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to sign out.",
        variant: "destructive",
      });
    }
  };

  const updateProfile = async (updates: { username?: string; balance?: number }) => {
    try {
      if (!user) throw new Error("User not authenticated");

      const { error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', user.id);

      if (error) throw error;
    } catch (error: any) {
      console.error("Error updating profile:", error.message);
      throw error;
    }
  };

  const validateTransaction = (transaction: Omit<Transaction, "id" | "timestamp">): boolean => {
    if (isNaN(transaction.amount) || transaction.amount <= 0) {
      toast({
        title: "Invalid Transaction",
        description: "Transaction amount must be greater than 0.",
        variant: "destructive",
      });
      return false;
    }

    transaction.amount = parseFloat(transaction.amount.toFixed(2));

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

  const addTransaction = async (transaction: Omit<Transaction, "id" | "timestamp">) => {
    if (transaction.status === "COMPLETED" && !validateTransaction(transaction)) {
      return;
    }

    try {
      if (!user) throw new Error("User not authenticated");

      const { data, error } = await supabase
        .from('transactions')
        .insert({
          user_id: user.id,
          amount: transaction.amount,
          type: transaction.type,
          status: transaction.status,
          details: transaction.details
        })
        .select()
        .single();

      if (error) throw error;

      const newTransaction: Transaction = {
        id: data.id,
        timestamp: new Date(data.timestamp),
        amount: data.amount,
        type: data.type,
        status: data.status,
        details: data.details
      };

      setTransactions((prev) => [newTransaction, ...prev]);

      if (transaction.status === "COMPLETED") {
        let newBalance;
        if (transaction.type === "DEPOSIT") {
          newBalance = balance + transaction.amount;
          toast({
            title: "Deposit Successful",
            description: `$${transaction.amount.toFixed(2)} has been added to your account.`,
          });
        } else if (transaction.type === "WITHDRAWAL") {
          newBalance = balance - transaction.amount;
          toast({
            title: "Withdrawal Successful",
            description: `$${transaction.amount.toFixed(2)} has been withdrawn from your account.`,
          });
        }

        if (newBalance !== undefined) {
          setBalance(parseFloat(newBalance.toFixed(2)));
          await updateProfile({ balance: newBalance });
        }
      }
    } catch (error: any) {
      console.error("Error adding transaction:", error.message);
      toast({
        title: "Transaction Failed",
        description: error.message || "An error occurred while processing your transaction.",
        variant: "destructive",
      });
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
    stake = parseFloat(stake.toFixed(2));

    if (stake > balance) {
      toast({
        title: "Insufficient Balance",
        description: "You don't have enough funds to place this trade.",
        variant: "destructive",
      });
      return;
    }
    
    try {
      if (!user) throw new Error("User not authenticated");

      const newBalance = parseFloat((balance - stake).toFixed(2));
      setBalance(newBalance);
      await updateProfile({ balance: newBalance });
      
      toast({
        title: "Trade Started",
        description: `Trading ${pair} with $${stake.toFixed(2)}`,
      });

      await new Promise((resolve) => setTimeout(resolve, duration * 1000));
      
      const isWin = Math.random() > 0.5;
      const profitAmount = isWin ? parseFloat((stake * profit / 100).toFixed(2)) : 0;
      
      const { data: tradeData, error: tradeError } = await supabase
        .from('trade_history')
        .insert({
          user_id: user.id,
          pair,
          market,
          stake,
          profit: profitAmount,
          result: isWin ? "WIN" : "LOSS",
          type
        })
        .select()
        .single();

      if (tradeError) throw tradeError;
      
      const tradeResult: TradeHistory = {
        id: tradeData.id,
        timestamp: new Date(tradeData.timestamp),
        pair,
        market,
        stake,
        profit: profitAmount,
        result: isWin ? "WIN" : "LOSS",
        type,
      };
      
      setTradeHistory((prev) => [tradeResult, ...prev]);
      
      if (isWin) {
        const updatedBalance = parseFloat((newBalance + stake + profitAmount).toFixed(2));
        setBalance(updatedBalance);
        await updateProfile({ balance: updatedBalance });
        
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
    } catch (error: any) {
      const refundBalance = parseFloat((balance).toFixed(2));
      setBalance(refundBalance);
      await updateProfile({ balance: refundBalance });
      
      console.error("Error executing trade:", error.message);
      toast({
        title: "Trade Error",
        description: error.message || "An error occurred while executing your trade.",
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
        signOut,
        session,
        user,
        isLoading
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
