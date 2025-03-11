
import AuthLayout from "@/components/layout/AuthLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { InfoIcon, PlayCircle, RefreshCw } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "@/hooks/use-toast";
import TradingViewChart from "@/components/charts/TradingViewChart";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type Market = "RISE_FALL" | "EVEN_ODD";
type CryptoPair = "BTC/USD" | "ETH/USD" | "SOL/USD" | "BNB/USD";

interface DemoTradeHistory {
  id: string;
  timestamp: Date;
  pair: CryptoPair;
  market: Market;
  stake: number;
  profit: number;
  result: "WIN" | "LOSS";
}

const Demo = () => {
  const [demoBalance, setDemoBalance] = useState<number>(() => {
    const savedDemoBalance = localStorage.getItem("vertex_demo_balance");
    return savedDemoBalance ? Number(savedDemoBalance) : 10000;
  });
  const [demoTradeHistory, setDemoTradeHistory] = useState<DemoTradeHistory[]>(() => {
    const savedHistory = localStorage.getItem("vertex_demo_tradeHistory");
    return savedHistory ? JSON.parse(savedHistory) : [];
  });
  const [tradeModalOpen, setTradeModalOpen] = useState(false);
  const [activePair, setActivePair] = useState<CryptoPair>("BTC/USD");
  const [stake, setStake] = useState<string>("");
  const [isExecuting, setIsExecuting] = useState<boolean>(false);
  const [countdown, setCountdown] = useState<number>(0);
  const [duration, setDuration] = useState<number>(2);
  const [profit, setProfit] = useState<number>(100);
  const [market, setMarket] = useState<Market>("RISE_FALL");

  // Save demo data to localStorage when it changes
  useEffect(() => {
    localStorage.setItem("vertex_demo_balance", demoBalance.toString());
    localStorage.setItem("vertex_demo_tradeHistory", JSON.stringify(demoTradeHistory));
  }, [demoBalance, demoTradeHistory]);

  // Execute a demo trade
  const executeDemoTrade = async (
    pair: CryptoPair,
    market: Market,
    stake: number,
    duration: number,
    profit: number
  ) => {
    // Check if user has enough demo balance
    if (stake > demoBalance) {
      toast({
        title: "Insufficient Demo Balance",
        description: "You don't have enough demo funds to place this trade.",
        variant: "destructive",
      });
      return;
    }

    // Deduct stake from demo balance
    setDemoBalance((prev) => prev - stake);
    
    toast({
      title: "Demo Trade Started",
      description: `Trading ${pair} with $${stake.toFixed(2)} (Demo)`,
    });

    // Start countdown
    setCountdown(duration);
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    // Simulate trade execution with the given duration
    try {
      await new Promise((resolve) => setTimeout(resolve, duration * 1000));
      
      // Simulate trade result (win/loss) - 50% chance of winning for demo
      const isWin = Math.random() > 0.5;
      const profitAmount = isWin ? (stake * profit / 100) : 0;
      
      // Create trade history entry
      const tradeResult: DemoTradeHistory = {
        id: `demo-trade-${Date.now()}-${Math.random().toString(36).substring(7)}`,
        timestamp: new Date(),
        pair,
        market,
        stake,
        profit: profitAmount,
        result: isWin ? "WIN" : "LOSS",
      };
      
      setDemoTradeHistory((prev) => [tradeResult, ...prev]);
      
      // Update demo balance if win
      if (isWin) {
        setDemoBalance((prev) => prev + stake + profitAmount);
        toast({
          title: "Demo Trade Successful!",
          description: `You won $${profitAmount.toFixed(2)} on ${pair}! (Demo)`,
          variant: "default",
        });
      } else {
        toast({
          title: "Demo Trade Lost",
          description: `You lost $${stake.toFixed(2)} on ${pair}. (Demo)`,
          variant: "default",
        });
      }
    } catch (error) {
      // Refund stake in case of error
      setDemoBalance((prev) => prev + stake);
      toast({
        title: "Demo Trade Error",
        description: "An error occurred while executing your demo trade.",
        variant: "destructive",
      });
    } finally {
      setIsExecuting(false);
      setStake("");
    }
  };

  const handleReset = () => {
    setDemoBalance(10000);
    setDemoTradeHistory([]);
    toast({
      title: "Demo Account Reset",
      description: "Your demo account has been reset to $10,000.",
    });
  };

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
    
    if (stakeAmount > demoBalance) {
      toast({
        title: "Insufficient Demo Balance",
        description: "You don't have enough demo funds for this trade.",
        variant: "destructive",
      });
      return;
    }
    
    setIsExecuting(true);
    
    try {
      // Execute the demo trade
      await executeDemoTrade(
        activePair,
        market,
        stakeAmount,
        duration,
        profit
      );
    } finally {
      setTradeModalOpen(false);
    }
  };

  const handleMax = () => {
    setStake(demoBalance.toString());
  };

  // Format market name for display
  const formatMarket = (market: Market) => {
    return market === "RISE_FALL" ? "Rise & Fall" : "Even/Odd";
  };

  // Get the 3 most recent demo trades
  const recentDemoTrades = demoTradeHistory.slice(0, 3);

  return (
    <AuthLayout title="Demo Trading">
      <div className="flex flex-col h-[calc(100vh-80px)] space-y-4">
        <Card className="bg-card/50 border-primary/50">
          <CardContent className="p-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="bg-primary/20 p-2 rounded-full">
                  <InfoIcon className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium">Demo Account</p>
                  <p className="text-sm text-muted-foreground">
                    Practice trading with virtual funds. Demo trades don't affect your real balance.
                  </p>
                </div>
              </div>
              <Button variant="outline" size="sm" onClick={handleReset} className="flex items-center gap-1.5">
                <RefreshCw className="h-4 w-4" />
                Reset Demo
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold">{activePair}</h2>
            <p className="text-muted-foreground">Demo Balance: ${demoBalance.toFixed(2)}</p>
          </div>
          <Button onClick={() => setTradeModalOpen(true)}>Place Demo Trade</Button>
        </div>
        
        <Card className="flex-grow bg-card">
          <CardHeader>
            <CardTitle>Demo Chart</CardTitle>
          </CardHeader>
          <CardContent className="p-2 h-[calc(100%-80px)]">
            <TradingViewChart 
              symbol="BITSTAMP:BTCUSD" 
              theme="dark" 
            />
          </CardContent>
        </Card>
        
        <div className="grid gap-6 md:grid-cols-2">
          <Card className="bg-card">
            <CardHeader>
              <CardTitle>Recent Demo Trades</CardTitle>
            </CardHeader>
            <CardContent>
              {recentDemoTrades.length === 0 ? (
                <div className="text-center py-4 text-muted-foreground">
                  No demo trades yet
                </div>
              ) : (
                <div className="space-y-3">
                  {recentDemoTrades.map((trade) => (
                    <div key={trade.id} className="flex justify-between items-center p-3 bg-background/50 rounded-lg">
                      <div>
                        <p className="font-medium">{trade.pair}</p>
                        <p className="text-xs text-muted-foreground">
                          {formatMarket(trade.market)} • ${trade.stake.toFixed(2)}
                        </p>
                      </div>
                      <div className={`text-right ${trade.result === "WIN" ? "text-success" : "text-error"}`}>
                        <p className="font-medium">
                          {trade.result === "WIN" ? `+$${trade.profit.toFixed(2)}` : `-$${trade.stake.toFixed(2)}`}
                        </p>
                        <p className="text-xs">
                          {trade.result}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              <Button 
                className="w-full mt-4 flex items-center justify-center gap-2"
                onClick={() => setTradeModalOpen(true)}
              >
                <PlayCircle className="h-5 w-5" />
                Start Demo Trading
              </Button>
            </CardContent>
          </Card>
          
          <Card className="bg-card">
            <CardHeader>
              <CardTitle>Tips for New Traders</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-muted-foreground">
                <li>• Start with demo trading to practice without risk</li>
                <li>• Learn technical analysis basics</li>
                <li>• Set clear profit targets and stop losses</li>
                <li>• Don't trade with money you can't afford to lose</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
      
      <Dialog open={tradeModalOpen} onOpenChange={(open) => !isExecuting && setTradeModalOpen(open)}>
        <DialogContent className="sm:max-w-[425px] bg-card text-foreground">
          <DialogHeader>
            <DialogTitle>Demo Trade</DialogTitle>
            <DialogDescription>
              Place a demo trade with virtual funds
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
                    Executing demo trade on {activePair}...
                  </p>
                  <div className="w-full h-2 bg-background rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-primary transition-all duration-1000"
                      style={{ 
                        width: `${(1 - countdown / duration) * 100}%` 
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
                        Demo Balance: ${demoBalance.toFixed(2)}
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
                        {formatMarket(market)}
                      </span>
                    </div>
                    <div className="flex flex-col gap-1">
                      <span className="text-sm font-medium">Pair</span>
                      <span className="text-muted-foreground">{activePair}</span>
                    </div>
                    <div className="flex flex-col gap-1">
                      <span className="text-sm font-medium">Duration</span>
                      <span className="text-muted-foreground">{duration} seconds</span>
                    </div>
                    <div className="flex flex-col gap-1">
                      <span className="text-sm font-medium">Profit</span>
                      <span className="text-muted-foreground">{profit}%</span>
                    </div>
                  </div>
                </>
              )}
            </div>
            {!isExecuting && (
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setTradeModalOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">
                  Confirm Demo Trade
                </Button>
              </DialogFooter>
            )}
          </form>
        </DialogContent>
      </Dialog>
    </AuthLayout>
  );
};

export default Demo;
