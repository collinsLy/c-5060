
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useUser } from "@/context/UserContext";
import { toast } from "@/hooks/use-toast";

type TradeType = "STANDARD" | "MASTER" | "PRO" | "CUSTOM";
type Market = "RISE_FALL" | "EVEN_ODD";
type CryptoPair = "BTC/USD" | "ETH/USD" | "SOL/USD" | "BNB/USD";

interface TradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  tradeType: TradeType;
  defaultPair: CryptoPair;
  defaultMarket: Market;
  defaultDuration: number;
  defaultProfit: number;
}

const TradeModal: React.FC<TradeModalProps> = ({
  isOpen,
  onClose,
  tradeType,
  defaultPair,
  defaultMarket,
  defaultDuration,
  defaultProfit,
}) => {
  const { balance, executeTrade } = useUser();
  const [stake, setStake] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isExecuting, setIsExecuting] = useState<boolean>(false);
  const [countdown, setCountdown] = useState<number>(0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const stakeAmount = parseFloat(stake);
    
    if (!stake || stakeAmount <= 0) {
      toast({
        title: "Invalid Stake",
        description: "Please enter a valid stake amount.",
        variant: "destructive",
      });
      return;
    }
    
    if (stakeAmount > balance) {
      toast({
        title: "Insufficient Balance",
        description: "You don't have enough funds for this trade.",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    setIsExecuting(true);
    
    // Start countdown
    setCountdown(defaultDuration);
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    try {
      // Execute the trade
      await executeTrade(
        defaultPair,
        defaultMarket,
        stakeAmount,
        defaultDuration,
        defaultProfit,
        tradeType
      );
    } finally {
      setIsLoading(false);
      setIsExecuting(false);
      setStake("");
      onClose();
    }
  };

  const handleMax = () => {
    setStake(balance.toString());
  };

  // Format market name for display
  const formatMarket = (market: Market) => {
    return market === "RISE_FALL" ? "Rise & Fall" : "Even/Odd";
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !isExecuting && onClose()}>
      <DialogContent className="sm:max-w-[425px] bg-card text-foreground">
        <DialogHeader>
          <DialogTitle>
            {tradeType === "STANDARD" && "Standard Bot Trade"}
            {tradeType === "MASTER" && "Master Bot Trade"}
            {tradeType === "PRO" && "Pro Bot Trade"}
            {tradeType === "CUSTOM" && "Custom Trade"}
          </DialogTitle>
          <DialogDescription>
            Place a trade using the {tradeType.toLowerCase()} trading bot.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            {isExecuting ? (
              <div className="grid place-items-center gap-4 py-8">
                <div className="text-5xl font-bold text-primary">
                  {countdown}s
                </div>
                <p className="text-center text-muted-foreground">
                  Executing trade on {defaultPair}...
                </p>
                <div className="w-full h-2 bg-background rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-primary transition-all duration-1000"
                    style={{ 
                      width: `${(1 - countdown / defaultDuration) * 100}%` 
                    }}
                  ></div>
                </div>
              </div>
            ) : (
              <>
                <div className="grid gap-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="amount">Stake Amount (USD)</Label>
                    <span className="text-sm text-muted-foreground">
                      Balance: ${balance.toFixed(2)}
                    </span>
                  </div>
                  <div className="relative">
                    <Input
                      id="amount"
                      type="number"
                      value={stake}
                      onChange={(e) => setStake(e.target.value)}
                      placeholder="Enter stake amount"
                      min="1"
                      step="0.01"
                      className="bg-background/50 pr-16"
                      required
                    />
                    <Button
                      type="button"
                      variant="secondary"
                      size="sm"
                      className="absolute right-1 top-1 h-7"
                      onClick={handleMax}
                    >
                      Max
                    </Button>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1">
                    <span className="text-sm font-medium">Market</span>
                    <span className="text-muted-foreground">
                      {formatMarket(defaultMarket)}
                    </span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-sm font-medium">Pair</span>
                    <span className="text-muted-foreground">{defaultPair}</span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-sm font-medium">Duration</span>
                    <span className="text-muted-foreground">{defaultDuration} seconds</span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-sm font-medium">Profit</span>
                    <span className="text-muted-foreground">{defaultProfit}%</span>
                  </div>
                </div>
              </>
            )}
          </div>
          {!isExecuting && (
            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Processing..." : "Confirm Trade"}
              </Button>
            </DialogFooter>
          )}
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default TradeModal;
