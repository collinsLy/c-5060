
import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Info } from "lucide-react";

const CardPaymentForm: React.FC = () => {
  return (
    <div className="grid gap-2">
      <div className="mt-2 p-3 bg-blue-50 border border-blue-200 rounded-md text-blue-800 text-xs flex items-start gap-2">
        <Info className="h-4 w-4 mt-0.5 flex-shrink-0" />
        <p>Card details will be collected securely on the Pesapal payment page. You'll be redirected after clicking "Deposit Funds".</p>
      </div>
      
      <Label htmlFor="email" className="mt-2">Email Address</Label>
      <Input
        id="email"
        type="email"
        placeholder="your@email.com"
        className="bg-background/50"
      />
      <p className="text-xs text-muted-foreground">
        Your email address for payment confirmation (optional).
      </p>
    </div>
  );
};

export default CardPaymentForm;
