
import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface MpesaPaymentFormProps {
  phoneNumber: string;
  setPhoneNumber: (value: string) => void;
}

const MpesaPaymentForm: React.FC<MpesaPaymentFormProps> = ({
  phoneNumber,
  setPhoneNumber,
}) => {
  return (
    <div className="grid gap-2">
      <Label htmlFor="phone-number">M-Pesa Phone Number</Label>
      <Input
        id="phone-number"
        type="tel"
        placeholder="e.g. 07XXXXXXXX"
        className="bg-background/50"
        value={phoneNumber}
        onChange={(e) => setPhoneNumber(e.target.value)}
        required
      />
      <p className="text-xs text-muted-foreground">
        Enter the phone number registered with M-Pesa. You will receive a prompt to complete the payment.
      </p>
      <div className="mt-2 p-3 bg-amber-50 border border-amber-200 rounded-md text-amber-800 text-xs">
        <p className="font-medium">Important:</p>
        <p>Keep your phone nearby. You'll receive a payment prompt on your M-Pesa registered number.</p>
      </div>
    </div>
  );
};

export default MpesaPaymentForm;
