
import React from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Phone } from "lucide-react";

interface PaymentMethodSelectorProps {
  paymentMethod: string;
  setPaymentMethod: (method: string) => void;
}

const PaymentMethodSelector: React.FC<PaymentMethodSelectorProps> = ({
  paymentMethod,
  setPaymentMethod,
}) => {
  return (
    <div className="grid gap-2">
      <Label htmlFor="payment-method">Payment Method</Label>
      <div className="flex flex-wrap gap-2">
        <Button
          type="button"
          variant={paymentMethod === "card" ? "default" : "outline"}
          onClick={() => setPaymentMethod("card")}
          className="flex-1"
        >
          Credit Card
        </Button>
        <Button
          type="button"
          variant={paymentMethod === "crypto" ? "default" : "outline"}
          onClick={() => setPaymentMethod("crypto")}
          className="flex-1"
        >
          Crypto Wallet
        </Button>
        <Button
          type="button"
          variant={paymentMethod === "mpesa" ? "default" : "outline"}
          onClick={() => setPaymentMethod("mpesa")}
          className="flex-1 flex items-center gap-2"
        >
          <Phone className="h-4 w-4" />
          M-Pesa
        </Button>
      </div>
    </div>
  );
};

export default PaymentMethodSelector;
