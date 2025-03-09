
import AuthLayout from "@/components/layout/AuthLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer } from "@/components/ui/chart";
import { Area, AreaChart, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import TradeModal from "@/components/modals/TradeModal";
import { useUser } from "@/context/UserContext";

// Demo chart data
const generateChartData = (pair: string) => {
  const data = [];
  let value = 0;
  
  if (pair === "BTC/USD") value = 60000;
  else if (pair === "ETH/USD") value = 3000;
  else if (pair === "SOL/USD") value = 120;
  else if (pair === "BNB/USD") value = 350;

  const baseValue = value;
  const volatility = baseValue * 0.02; // 2% volatility
  
  for (let i = 0; i < 30; i++) {
    const change = (Math.random() - 0.5) * volatility;
    value += change;
    data.push({
      time: `${i}:00`,
      value: value < baseValue * 0.9 ? baseValue * 0.9 : value > baseValue * 1.1 ? baseValue * 1.1 : value,
    });
  }
  
  return data;
};

const Trade = () => {
  const { balance } = useUser();
  const [activePair, setActivePair] = useState<"BTC/USD" | "ETH/USD" | "SOL/USD" | "BNB/USD">("BTC/USD");
  const [chartData, setChartData] = useState(generateChartData(activePair));
  const [tradeModalOpen, setTradeModalOpen] = useState(false);
  
  const changePair = (pair: "BTC/USD" | "ETH/USD" | "SOL/USD" | "BNB/USD") => {
    setActivePair(pair);
    setChartData(generateChartData(pair));
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
              <ChartContainer
                config={{
                  area: {
                    theme: {
                      light: "#7C3AED",
                      dark: "#7C3AED",
                    },
                  },
                }}
              >
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#7C3AED" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#7C3AED" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="time" />
                  <YAxis domain={['auto', 'auto']} />
                  <Tooltip />
                  <Area
                    type="monotone"
                    dataKey="value"
                    stroke="#7C3AED"
                    fillOpacity={1}
                    fill="url(#chartGradient)"
                  />
                </AreaChart>
              </ChartContainer>
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
