
import AuthLayout from "@/components/layout/AuthLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import TradeModal from "@/components/modals/TradeModal";

const Bots = () => {
  const [activeModal, setActiveModal] = useState<{
    isOpen: boolean;
    type: "STANDARD" | "MASTER" | "PRO" | "CUSTOM";
    pair: "BTC/USD" | "ETH/USD" | "SOL/USD" | "BNB/USD";
    market: "RISE_FALL" | "EVEN_ODD";
    duration: number;
    profit: number;
  } | null>(null);

  const openTradeModal = (
    type: "STANDARD" | "MASTER" | "PRO" | "CUSTOM",
    pair: "BTC/USD" | "ETH/USD" | "SOL/USD" | "BNB/USD",
    market: "RISE_FALL" | "EVEN_ODD",
    duration: number,
    profit: number
  ) => {
    setActiveModal({
      isOpen: true,
      type,
      pair,
      market,
      duration,
      profit,
    });
  };

  return (
    <AuthLayout title="Trading Bots">
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {/* Standard Bot */}
        <Card className="overflow-hidden hover:shadow-lg transition-shadow">
          <CardHeader className="bg-primary/10">
            <CardTitle>STANDARD BOT</CardTitle>
            <CardDescription>
              <span className="text-2xl font-bold text-primary">$20</span>{" "}
              <span className="text-muted-foreground">USD</span>
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Duration</span>
                <span className="font-medium">2 seconds</span>
              </div>
              <div className="flex justify-between">
                <span>Market</span>
                <span className="font-medium">Rise & Fall</span>
              </div>
              <div className="flex justify-between">
                <span>Pair</span>
                <span className="font-medium">SOL/USD</span>
              </div>
              <div className="flex justify-between">
                <span>Profit</span>
                <span className="font-medium text-success">100%</span>
              </div>
            </div>
            <Button 
              className="w-full" 
              onClick={() => openTradeModal("STANDARD", "SOL/USD", "RISE_FALL", 2, 100)}
            >
              Trade with Standard Bot
            </Button>
          </CardContent>
        </Card>

        {/* Master Bot */}
        <Card 
          className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
          onClick={() => openTradeModal("MASTER", "BTC/USD", "EVEN_ODD", 2, 80)}
        >
          <CardHeader className="bg-accent/10">
            <CardTitle>MASTER BOT</CardTitle>
            <CardDescription>
              <span className="text-2xl font-bold text-accent">$40</span>{" "}
              <span className="text-muted-foreground">USD</span>
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Duration</span>
                <span className="font-medium">2 seconds</span>
              </div>
              <div className="flex justify-between">
                <span>Market</span>
                <span className="font-medium">Even/Odd</span>
              </div>
              <div className="flex justify-between">
                <span>Pair</span>
                <span className="font-medium">BTC/USD</span>
              </div>
              <div className="flex justify-between">
                <span>Profit</span>
                <span className="font-medium text-success">80%</span>
              </div>
            </div>
            <Button className="w-full">Trade with Master Bot</Button>
          </CardContent>
        </Card>

        {/* BNB/USD Trading */}
        <Card className="overflow-hidden hover:shadow-lg transition-shadow">
          <CardHeader className="bg-warning/10">
            <CardTitle>BNB/USD</CardTitle>
            <CardDescription>
              <span className="text-2xl font-bold text-warning">$30</span>{" "}
              <span className="text-muted-foreground">USD</span>
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Duration</span>
                <span className="font-medium">3 seconds</span>
              </div>
              <div className="flex justify-between">
                <span>Market</span>
                <span className="font-medium">Even/Odd</span>
              </div>
              <div className="flex justify-between">
                <span>Pair</span>
                <span className="font-medium">BNB/USD</span>
              </div>
              <div className="flex justify-between">
                <span>Profit</span>
                <span className="font-medium text-success">100%</span>
              </div>
            </div>
            <Button 
              className="w-full"
              onClick={() => openTradeModal("CUSTOM", "BNB/USD", "EVEN_ODD", 3, 100)}
            >
              Trade BNB/USD
            </Button>
          </CardContent>
        </Card>

        {/* Pro Bot */}
        <Card 
          className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
          onClick={() => openTradeModal("PRO", "ETH/USD", "EVEN_ODD", 1, 200)}
        >
          <CardHeader className="bg-success/10">
            <CardTitle>PRO BOT</CardTitle>
            <CardDescription>
              <span className="text-2xl font-bold text-success">$200</span>{" "}
              <span className="text-muted-foreground">USD</span>
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Duration</span>
                <span className="font-medium">1 second</span>
              </div>
              <div className="flex justify-between">
                <span>Market</span>
                <span className="font-medium">Even/Odd</span>
              </div>
              <div className="flex justify-between">
                <span>Pair</span>
                <span className="font-medium">ETH/USD</span>
              </div>
              <div className="flex justify-between">
                <span>Scope</span>
                <span className="font-medium">All Markets</span>
              </div>
              <div className="flex justify-between">
                <span>Profit</span>
                <span className="font-medium text-success">200%</span>
              </div>
            </div>
            <Button className="w-full">Trade with Pro Bot</Button>
          </CardContent>
        </Card>
      </div>

      {activeModal && (
        <TradeModal
          isOpen={activeModal.isOpen}
          onClose={() => setActiveModal(null)}
          tradeType={activeModal.type}
          defaultPair={activeModal.pair}
          defaultMarket={activeModal.market}
          defaultDuration={activeModal.duration}
          defaultProfit={activeModal.profit}
        />
      )}
    </AuthLayout>
  );
};

export default Bots;
