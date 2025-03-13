
import React, { createContext, useContext, useState, useEffect } from "react";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./AuthContext";

export interface Transaction {
  id: string;
  timestamp: Date;
  amount: number;
  type: "DEPOSIT" | "WITHDRAWAL";
  status: "COMPLETED" | "PENDING" | "FAILED";
  details?: string;
}

interface FinanceContextType {
  balance: number;
  setBalance: (balance: number) => void;
  transactions: Transaction[];
  addTransaction: (transaction: Omit<Transaction, "id" | "timestamp">) => void;
}

const FinanceContext = createContext<FinanceContextType | undefined>(undefined);

export const FinanceProvider: React.FC<{ children: React.ReactNode }> = ({ 
  children 
}) => {
  const { user, isLoading } = useAuth();
  const [balance, setBalance] = useState<number>(0);
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    const loadFinanceData = async () => {
      if (!user) return;
      
      try {
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('balance')
          .eq('id', user.id)
          .single();

        if (profileError) throw profileError;
        
        if (profileData) {
          setBalance(profileData.balance || 0);
        }

        const { data: transactionData, error: transactionError } = await supabase
          .from('transactions')
          .select('*')
          .eq('user_id', user.id)
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
        console.error("Error loading finance data:", error.message);
        toast({
          title: "Error",
          description: "Failed to load financial data. Please try refreshing the page.",
          variant: "destructive",
        });
      }
    };

    if (user && !isLoading) {
      loadFinanceData();
    } else if (!user && !isLoading) {
      setBalance(0);
      setTransactions([]);
    }
  }, [user, isLoading]);

  const updateProfile = async (updates: { balance?: number }) => {
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
        type: data.type as "DEPOSIT" | "WITHDRAWAL",
        status: data.status as "COMPLETED" | "PENDING" | "FAILED",
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

  return (
    <FinanceContext.Provider
      value={{
        balance,
        setBalance,
        transactions,
        addTransaction
      }}
    >
      {children}
    </FinanceContext.Provider>
  );
};

export const useFinance = () => {
  const context = useContext(FinanceContext);
  if (context === undefined) {
    throw new Error("useFinance must be used within a FinanceProvider");
  }
  return context;
};
