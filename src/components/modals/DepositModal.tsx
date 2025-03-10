
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useUser } from "@/context/UserContext";
import { toast } from "@/hooks/use-toast";
import { Phone } from "lucide-react";

interface DepositModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const DepositModal: React.FC<DepositModalProps> = ({ isOpen, onClose }) => {
  const { addTransaction } = useUser();
  const [amount, setAmount] = useState<string>("");
  const [paymentMethod, setPaymentMethod] = useState<string>("card");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [phoneNumber, setPhoneNumber] = useState<string>("");

  // PesaPal config - in a production environment, these would be stored securely
  const pesapalConfig = {
    consumerKey: "RfjTb7Vfoa7ULQ757RmojeFWC8crRbyX",
    consumerSecret: "hzBxk/UrOi+FKbiy0tiEOhe4UN4=",
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!amount || parseFloat(amount) <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid deposit amount.",
        variant: "destructive",
      });
      return;
    }

    if (paymentMethod === "mpesa" && (!phoneNumber || phoneNumber.length < 10)) {
      toast({
        title: "Invalid Phone Number",
        description: "Please enter a valid M-Pesa phone number.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    // Simulate processing
    await new Promise((resolve) => setTimeout(resolve, 1500));
    
    // In a real implementation, we would integrate with the PesaPal API here
    // This would involve:
    // 1. Creating a payment request to PesaPal
    // 2. Handling the callback/redirect
    // 3. Verifying the payment status
    
    if (paymentMethod === "mpesa") {
      console.log("Processing M-Pesa payment with PesaPal:", {
        amount,
        phoneNumber,
        ...pesapalConfig
      });
    }
    
    // Add transaction to history
    addTransaction({
      amount: parseFloat(amount),
      type: "DEPOSIT",
      status: "COMPLETED",
      details: `Via ${
        paymentMethod === "card" 
          ? "Credit Card" 
          : paymentMethod === "crypto" 
            ? "Crypto Wallet" 
            : `M-Pesa (${phoneNumber})`
      }`,
    });
    
    setIsLoading(false);
    setAmount("");
    setPhoneNumber("");
    onClose();
    
    toast({
      title: "Deposit Initiated",
      description: paymentMethod === "mpesa" 
        ? "Check your phone for the M-Pesa prompt."
        : "Your deposit has been processed successfully.",
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] bg-card text-foreground">
        <DialogHeader>
          <DialogTitle>Deposit Funds</DialogTitle>
          <DialogDescription>
            Add funds to your Vertex Trading account.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="amount">Amount (USD)</Label>
              <Input
                id="amount"
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Enter amount"
                min="1"
                step="0.01"
                className="bg-background/50"
                required
              />
            </div>
            
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
            
            {paymentMethod === "card" && (
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
            )}
            
            {paymentMethod === "crypto" && (
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
            )}
            
            {paymentMethod === "mpesa" && (
              <div className="grid gap-2">
                <Label htmlFor="phone-number">M-Pesa Phone Number</Label>
                <Input
                  id="phone-number"
                  type="tel"
                  placeholder="e.g. 07XXXXXXXX"
                  className="bg-background/50"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  required={paymentMethod === "mpesa"}
                />
                <p className="text-xs text-muted-foreground">
                  Enter the phone number registered with M-Pesa. You will receive a prompt to complete the payment.
                </p>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Processing..." : "Deposit Funds"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default DepositModal;
