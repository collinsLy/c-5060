
import React, { createContext, useContext, useState, useEffect } from "react";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./AuthContext";
import { useFinance } from "./FinanceContext";

export type TradeType = "STANDARD" | "MASTER" | "PRO" | "CUSTOM";
export type Market = "RISE_FALL" | "EVEN_ODD";
export type CryptoPair = "BTC/USD" | "ETH/USD" | "SOL/USD" | "BNB/USD";

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

interface TradeContextType {
  tradeHistory: TradeHistory[];
  executeTrade: (
    pair: CryptoPair,
    market: Market,
    stake: number,
    duration: number,
    profit: number,
    type: TradeType
  ) => Promise<void>;
}

const TradeContext = createContext<TradeContextType | undefined>(undefined);

export const TradeProvider: React.FC<{ children: React.ReactNode }> = ({ 
  children 
}) => {
  const { user, isLoading } = useAuth();
  const { balance, setBalance } = useFinance();
  const [tradeHistory, setTradeHistory] = useState<TradeHistory[]>([]);

  useEffect(() => {
    const loadTradeData = async () => {
      if (!user) return;
      
      try {
        const { data: tradeData, error: tradeError } = await supabase
          .from('trade_history')
          .select('*')
          .eq('user_id', user.id)
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
      } catch (error: any) {
        console.error("Error loading trade data:", error.message);
        toast({
          title: "Error",
          description: "Failed to load trade history. Please try refreshing the page.",
          variant: "destructive",
        });
      }
    };

    if (user && !isLoading) {
      loadTradeData();
    } else if (!user && !isLoading) {
      setTradeHistory([]);
    }
  }, [user, isLoading]);

  const updateProfile = async (updates: { balance: number }) => {
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

  const executeTrade = async (
    pair: CryptoPair,
    market: Market,
    stake: number,
    duration: number,
    profit: number,
    type: TradeType
  ) => {
    stake = parseFloat(stake.toFixed(2));
    let transactionStarted = false;

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
      transactionStarted = true;
      
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
          type,
          status: "COMPLETED"
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
      console.error("Error executing trade:", error.message);
      
      if (transactionStarted) {
        const refundBalance = parseFloat((balance).toFixed(2));
        setBalance(refundBalance);
        await updateProfile({ balance: refundBalance }).catch(console.error);
      }
      
      toast({
        title: "Trade Error",
        description: error.message || "An error occurred while executing your trade.",
        variant: "destructive",
      });
    }
  };

  return (
    <TradeContext.Provider
      value={{
        tradeHistory,
        executeTrade
      }}
    >
      {children}
    </TradeContext.Provider>
  );
};

export const useTrade = () => {
  const context = useContext(TradeContext);
  if (context === undefined) {
    throw new Error("useTrade must be used within a TradeProvider");
  }
  return context;
};
