
import React from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Phone, CreditCard, Wallet } from "lucide-react";

interface PaymentMethodSelectorProps {
  paymentMethod: string;
  setPaymentMethod: (method: string) => void;
  disabled?: boolean;
}

const PaymentMethodSelector: React.FC<PaymentMethodSelectorProps> = ({
  paymentMethod,
  setPaymentMethod,
  disabled = false,
}) => {
  return (
    <div className="grid gap-2">
      <Label htmlFor="payment-method">Payment Method</Label>
      <div className="flex flex-wrap gap-2">
        <Button
          type="button"
          variant={paymentMethod === "card" ? "default" : "outline"}
          onClick={() => setPaymentMethod("card")}
          className="flex-1 flex items-center gap-2 justify-center"
          disabled={disabled}
        >
          <CreditCard className="h-4 w-4" />
          Credit Card
        </Button>
        <Button
          type="button"
          variant={paymentMethod === "crypto" ? "default" : "outline"}
          onClick={() => setPaymentMethod("crypto")}
          className="flex-1 flex items-center gap-2 justify-center"
          disabled={disabled}
        >
          <Wallet className="h-4 w-4" />
          Crypto
        </Button>
        <Button
          type="button"
          variant={paymentMethod === "mpesa" ? "default" : "outline"}
          onClick={() => setPaymentMethod("mpesa")}
          className="flex-1 flex items-center gap-2 justify-center"
          disabled={disabled}
        >
          <Phone className="h-4 w-4" />
          M-Pesa
        </Button>
      </div>
    </div>
  );
};

export default PaymentMethodSelector;
