
import React from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

const CryptoPaymentForm: React.FC = () => {
  return (
    <div className="grid gap-2">
      <Label htmlFor="wallet-address">Select Cryptocurrency</Label>
      <div className="flex flex-wrap gap-2">
        {["BTC", "ETH", "USDT", "SOL"].map((crypto) => (
          <Button
            key={crypto}
            type="button"
            variant="outline"
            className="bg-background/50"
          >
            {crypto}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default CryptoPaymentForm;
