
import AuthLayout from "@/components/layout/AuthLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { InfoIcon, PlayCircle } from "lucide-react";
import { useState } from "react";
import TradeModal from "@/components/modals/TradeModal";
import TradingViewChart from "@/components/charts/TradingViewChart";

const Demo = () => {
  const [demoBalance, setDemoBalance] = useState(10000);
  const [tradeModalOpen, setTradeModalOpen] = useState(false);
  const [activePair, setActivePair] = useState("BTC/USD");

  return (
    <AuthLayout title="Demo Trading">
      <div className="flex flex-col h-[calc(100vh-80px)] space-y-4">
        <Card className="bg-card/50 border-primary/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="bg-primary/20 p-2 rounded-full">
                <InfoIcon className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="font-medium">Demo Account</p>
                <p className="text-sm text-muted-foreground">
                  Practice trading with $10,000 in virtual funds. Demo trades don't affect your real balance.
                </p>
              </div>
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
              <CardTitle>Quick Demo Trade</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-muted-foreground">Practice trading without risking real funds</p>
                <Button 
                  className="w-full flex items-center justify-center gap-2"
                  onClick={() => setTradeModalOpen(true)}
                >
                  <PlayCircle className="h-5 w-5" />
                  Start Demo Trading
                </Button>
              </div>
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
      
      <TradeModal
        isOpen={tradeModalOpen}
        onClose={() => setTradeModalOpen(false)}
        tradeType="CUSTOM"
        defaultPair={activePair as any}
        defaultMarket="RISE_FALL"
        defaultDuration={2}
        defaultProfit={100}
      />
    </AuthLayout>
  );
};

export default Demo;
