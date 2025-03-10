
import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const CardPaymentForm: React.FC = () => {
  return (
    <div className="grid gap-2">
      <Label htmlFor="card-number">Card Number</Label>
      <Input
        id="card-number"
        type="text"
        placeholder="**** **** **** ****"
        className="bg-background/50"
      />
      <div className="grid grid-cols-2 gap-2">
        <div>
          <Label htmlFor="expiry">Expiry Date</Label>
          <Input
            id="expiry"
            type="text"
            placeholder="MM/YY"
            className="bg-background/50"
          />
        </div>
        <div>
          <Label htmlFor="cvv">CVV</Label>
          <Input
            id="cvv"
            type="text"
            placeholder="123"
            className="bg-background/50"
          />
        </div>
      </div>
    </div>
  );
};

export default CardPaymentForm;
