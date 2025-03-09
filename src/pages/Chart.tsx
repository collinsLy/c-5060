
import AuthLayout from "@/components/layout/AuthLayout";
import { Card } from "@/components/ui/card";
import TradingViewChart from "@/components/charts/TradingViewChart";
import { useState } from "react";
import { Button } from "@/components/ui/button";

type CryptoPair = "BTC/USD" | "ETH/USD" | "SOL/USD" | "BNB/USD";

// Map our internal pair names to TradingView symbols
const pairToTradingViewSymbol = {
  "BTC/USD": "BITSTAMP:BTCUSD",
  "ETH/USD": "BITSTAMP:ETHUSD", 
  "SOL/USD": "COINBASE:SOLUSD",
  "BNB/USD": "BINANCE:BNBUSDT"
};

const Chart = () => {
  const [activePair, setActivePair] = useState<CryptoPair>("BTC/USD");
  const [timeframe, setTimeframe] = useState<string>("15");

  return (
    <AuthLayout title="Advanced Charts">
      <div className="flex flex-col h-[calc(100vh-80px)]">
        <div className="flex flex-col md:flex-row justify-between gap-2 mb-2">
          <div className="flex flex-wrap gap-2">
            <Button 
              variant={activePair === "BTC/USD" ? "default" : "outline"} 
              size="sm"
              onClick={() => setActivePair("BTC/USD")}
            >
              BTC/USD
            </Button>
            <Button 
              variant={activePair === "ETH/USD" ? "default" : "outline"} 
              size="sm"
              onClick={() => setActivePair("ETH/USD")}
            >
              ETH/USD
            </Button>
            <Button 
              variant={activePair === "SOL/USD" ? "default" : "outline"} 
              size="sm"
              onClick={() => setActivePair("SOL/USD")}
            >
              SOL/USD
            </Button>
            <Button 
              variant={activePair === "BNB/USD" ? "default" : "outline"} 
              size="sm"
              onClick={() => setActivePair("BNB/USD")}
            >
              BNB/USD
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button 
              variant={timeframe === "1" ? "default" : "outline"} 
              size="sm"
              onClick={() => setTimeframe("1")}
            >
              1m
            </Button>
            <Button 
              variant={timeframe === "5" ? "default" : "outline"} 
              size="sm"
              onClick={() => setTimeframe("5")}
            >
              5m
            </Button>
            <Button 
              variant={timeframe === "15" ? "default" : "outline"} 
              size="sm"
              onClick={() => setTimeframe("15")}
            >
              15m
            </Button>
            <Button 
              variant={timeframe === "60" ? "default" : "outline"} 
              size="sm"
              onClick={() => setTimeframe("60")}
            >
              1h
            </Button>
            <Button 
              variant={timeframe === "D" ? "default" : "outline"} 
              size="sm"
              onClick={() => setTimeframe("D")}
            >
              1D
            </Button>
          </div>
        </div>
        
        <Card className="p-1 flex-grow h-full">
          <TradingViewChart 
            symbol={pairToTradingViewSymbol[activePair]} 
            theme="dark"
            interval={timeframe}
            autosize={true}
            height={800}
          />
        </Card>
      </div>
    </AuthLayout>
  );
};

export default Chart;
