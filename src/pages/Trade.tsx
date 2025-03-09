
import AuthLayout from "@/components/layout/AuthLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import TradeModal from "@/components/modals/TradeModal";
import { useUser } from "@/context/UserContext";
import TradingViewChart from "@/components/charts/TradingViewChart";

// Define type for cryptocurrencies
type CryptoPair = "BTC/USD" | "ETH/USD" | "SOL/USD" | "BNB/USD";

// Map our internal pair names to TradingView symbols
const pairToTradingViewSymbol = {
  "BTC/USD": "BITSTAMP:BTCUSD",
  "ETH/USD": "BITSTAMP:ETHUSD",
  "SOL/USD": "COINBASE:SOLUSD",
  "BNB/USD": "BINANCE:BNBUSDT"
};

const Trade = () => {
  const { balance } = useUser();
  const [activePair, setActivePair] = useState<CryptoPair>("BTC/USD");
  const [tradeModalOpen, setTradeModalOpen] = useState(false);
  
  const changePair = (pair: CryptoPair) => {
    setActivePair(pair);
  };

  return (
    <AuthLayout title="Trade">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold">{activePair}</h2>
            <p className="text-muted-foreground">Current Balance: ${balance.toFixed(2)}</p>
          </div>
          <Button onClick={() => setTradeModalOpen(true)}>Place Trade</Button>
        </div>
        
        <Card className="bg-card">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Chart</CardTitle>
              <div className="flex gap-2">
                <Button 
                  variant={activePair === "BTC/USD" ? "default" : "outline"} 
                  size="sm"
                  onClick={() => changePair("BTC/USD")}
                >
                  BTC/USD
                </Button>
                <Button 
                  variant={activePair === "ETH/USD" ? "default" : "outline"} 
                  size="sm"
                  onClick={() => changePair("ETH/USD")}
                >
                  ETH/USD
                </Button>
                <Button 
                  variant={activePair === "SOL/USD" ? "default" : "outline"} 
                  size="sm"
                  onClick={() => changePair("SOL/USD")}
                >
                  SOL/USD
                </Button>
                <Button 
                  variant={activePair === "BNB/USD" ? "default" : "outline"} 
                  size="sm"
                  onClick={() => changePair("BNB/USD")}
                >
                  BNB/USD
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-[400px]">
              <TradingViewChart 
                symbol={pairToTradingViewSymbol[activePair]} 
                theme="dark" 
              />
            </div>
          </CardContent>
        </Card>
        
        <div className="grid gap-6 md:grid-cols-2">
          <Card className="bg-card">
            <CardHeader>
              <CardTitle>Quick Trade</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-muted-foreground">Select market type and place your trade</p>
                <div className="flex gap-4">
                  <Button 
                    className="flex-1"
                    onClick={() => setTradeModalOpen(true)}
                  >
                    Rise & Fall
                  </Button>
                  <Button 
                    className="flex-1"
                    variant="outline"
                    onClick={() => setTradeModalOpen(true)}
                  >
                    Even/Odd
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-card">
            <CardHeader>
              <CardTitle>Trading Tips</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-muted-foreground">
                <li>• Watch market trends before placing a trade</li>
                <li>• Start with smaller trades to practice</li>
                <li>• Don't trade more than you can afford to lose</li>
                <li>• Try different trading bots to find your style</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
      
      <TradeModal
        isOpen={tradeModalOpen}
        onClose={() => setTradeModalOpen(false)}
        tradeType="CUSTOM"
        defaultPair={activePair}
        defaultMarket="RISE_FALL"
        defaultDuration={2}
        defaultProfit={100}
      />
    </AuthLayout>
  );
};

export default Trade;
