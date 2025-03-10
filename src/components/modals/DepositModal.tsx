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
    domain: "vertex-trading.com", // Domain registered with PesaPal
    ipnListenerUrl: "https://vertex-trading.com/api/payments/ipn", // URL to receive payment notifications
    callbackUrl: "https://vertex-trading.com/dashboard", // URL to redirect after payment
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
    if (paymentMethod === "mpesa") {
      try {
        console.log("Processing M-Pesa payment with PesaPal:", {
          amount,
          phoneNumber,
          ...pesapalConfig
        });
        
        // In a real implementation, this would be an API call to your backend
        // which would then make a request to PesaPal's API
        
        // Simulating PesaPal API request
        const orderInfo = {
          id: `order-${Date.now()}`,
          amount: parseFloat(amount),
          description: `Deposit to Vertex Trading Account`,
          payment_method: "mpesa",
          phone_number: phoneNumber,
          currency: "USD",
          callback_url: pesapalConfig.callbackUrl,
          notification_id: `notify-${Date.now()}`,
        };
        
        // Send payment request to PesaPal (simulated)
        // In a real app, this would be a fetch/axios call to your backend
        
        // After successful payment initialization
        toast({
          title: "M-Pesa Request Sent",
          description: "You should receive an M-Pesa prompt on your phone shortly. Please check your phone and enter your PIN to complete the transaction.",
        });
        
        // Add transaction with PENDING status initially
        addTransaction({
          amount: parseFloat(amount),
          type: "DEPOSIT",
          status: "PENDING", // Status is PENDING until we get confirmation
          details: `Via M-Pesa (${phoneNumber})`,
        });
        
        // For demo purposes, we'll simulate a successful payment after 5 seconds
        setTimeout(() => {
          toast({
            title: "Payment Successful",
            description: `Your deposit of $${parseFloat(amount).toFixed(2)} via M-Pesa has been received.`,
          });
          
          // Update the transaction to COMPLETED (this would normally happen via the IPN)
          addTransaction({
            amount: parseFloat(amount),
            type: "DEPOSIT",
            status: "COMPLETED",
            details: `Via M-Pesa (${phoneNumber})`,
          });
        }, 5000);
        
      } catch (error) {
        console.error("Error processing payment:", error);
        toast({
          title: "Payment Error",
          description: "There was an error processing your payment. Please try again.",
          variant: "destructive",
        });
      }
    } else {
      // Process other payment methods as before
      addTransaction({
        amount: parseFloat(amount),
        type: "DEPOSIT",
        status: "COMPLETED",
        details: `Via ${
          paymentMethod === "card" 
            ? "Credit Card" 
            : "Crypto Wallet"
        }`,
      });
      
      toast({
        title: "Deposit Successful",
        description: "Your deposit has been processed successfully.",
      });
    }
    
    setIsLoading(false);
    setAmount("");
    setPhoneNumber("");
    onClose();
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
                <div className="mt-2 p-3 bg-amber-50 border border-amber-200 rounded-md text-amber-800 text-xs">
                  <p className="font-medium">Important:</p>
                  <p>Keep your phone nearby. You'll receive a payment prompt on your M-Pesa registered number.</p>
                </div>
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
