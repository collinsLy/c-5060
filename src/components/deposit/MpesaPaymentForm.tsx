
import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Phone, Mail } from "lucide-react";

interface MpesaPaymentFormProps {
  phoneNumber: string;
  setPhoneNumber: (value: string) => void;
  email: string;
  setEmail: (value: string) => void;
  isLoading?: boolean;
}

const MpesaPaymentForm: React.FC<MpesaPaymentFormProps> = ({
  phoneNumber,
  setPhoneNumber,
  email,
  setEmail,
  isLoading = false,
}) => {
  // Format phone number as user types
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Remove non-numeric characters
    let value = e.target.value.replace(/\D/g, '');
    
    // Add country code if not present
    if (value && !value.startsWith('254')) {
      // If starts with 0, replace with 254
      if (value.startsWith('0')) {
        value = '254' + value.substring(1);
      } else if (!value.startsWith('254')) {
        value = '254' + value;
      }
    }
    
    setPhoneNumber(value);
  };

  return (
    <div className="grid gap-2">
      <Label htmlFor="phone-number" className="flex items-center gap-2">
        <Phone className="h-4 w-4" /> M-Pesa Phone Number
      </Label>
      <Input
        id="phone-number"
        type="tel"
        placeholder="e.g. 254XXXXXXXXX"
        className="bg-background/50"
        value={phoneNumber}
        onChange={handlePhoneChange}
        required
        disabled={isLoading}
      />
      <p className="text-xs text-muted-foreground">
        Enter your phone number in international format (254XXXXXXXXX). You will receive a prompt to complete the payment.
      </p>
      
      <Label htmlFor="email" className="flex items-center gap-2 mt-2">
        <Mail className="h-4 w-4" /> Email Address
      </Label>
      <Input
        id="email"
        type="email"
        placeholder="your@email.com"
        className="bg-background/50"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        disabled={isLoading}
      />
      <p className="text-xs text-muted-foreground">
        Your email address for payment confirmation.
      </p>
      
      <div className="mt-2 p-3 bg-amber-50 border border-amber-200 rounded-md text-amber-800 text-xs">
        <p className="font-medium">Important:</p>
        <p>Keep your phone nearby. You'll be redirected to the Pesapal payment gateway to complete your payment.</p>
        <p className="mt-1">This payment is processed securely through PesaPal.</p>
      </div>
    </div>
  );
};

export default MpesaPaymentForm;
