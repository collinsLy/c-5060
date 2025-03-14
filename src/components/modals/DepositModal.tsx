
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
import PaymentMethodSelector from "@/components/deposit/PaymentMethodSelector";
import MpesaPaymentForm from "@/components/deposit/MpesaPaymentForm";
import PaymentIframeModal from "@/components/modals/PaymentIframeModal";

interface DepositModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const DepositModal: React.FC<DepositModalProps> = ({ isOpen, onClose }) => {
  const { addTransaction, balance } = useUser();
  const [amount, setAmount] = useState<string>("");
  const [paymentMethod, setPaymentMethod] = useState<string>("mpesa");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState<boolean>(false);
  const [paymentUrl, setPaymentUrl] = useState<string>("");

  const validateForm = (): boolean => {
    // Validate amount
    if (!amount || isNaN(parseFloat(amount)) || parseFloat(amount) <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid deposit amount.",
        variant: "destructive",
      });
      return false;
    }

    // Payment method specific validations
    if (paymentMethod === "mpesa" && !phoneNumber) {
      toast({
        title: "Missing Phone Number",
        description: "Please enter your M-Pesa phone number.",
        variant: "destructive",
      });
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    
    try {
      // Build the payment URL with query parameters
      const basePaymentUrl = "https://ffd4603c-a6b1-4aa9-a884-836873a74217-00-12y2chpnbj16v.picard.replit.dev/";
      const params = new URLSearchParams({
        amount: amount,
        phone: phoneNumber,
        email: email || '',
        method: paymentMethod,
      });
      
      const fullPaymentUrl = `${basePaymentUrl}?${params.toString()}`;
      setPaymentUrl(fullPaymentUrl);
      
      // Open the payment modal
      setIsPaymentModalOpen(true);
      
      // Record the pending transaction
      addTransaction({
        amount: parseFloat(amount),
        type: "DEPOSIT",
        status: "PENDING",
        details: `${paymentMethod === "mpesa" ? "M-Pesa" : paymentMethod} payment initiated`,
      });
      
    } catch (error) {
      console.error("Payment processing error:", error);
      toast({
        title: "Payment Error",
        description: "There was an error processing your request. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePaymentModalClose = () => {
    setIsPaymentModalOpen(false);
    // You can add logic here to check payment status if needed
  };

  const handleClose = () => {
    if (!isLoading) {
      setAmount("");
      setPhoneNumber("");
      setEmail("");
      onClose();
    } else {
      // Confirm before closing if a transaction is in progress
      const confirmClose = window.confirm("A transaction is in progress. Are you sure you want to close this window?");
      if (confirmClose) {
        setIsLoading(false);
        onClose();
      }
    }
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={handleClose}>
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
                <div className="flex justify-between items-center">
                  <Label htmlFor="amount">Amount (USD)</Label>
                  <span className="text-sm text-muted-foreground">
                    Balance: ${balance.toFixed(2)}
                  </span>
                </div>
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
                  disabled={isLoading}
                />
              </div>
              
              <PaymentMethodSelector
                paymentMethod={paymentMethod}
                setPaymentMethod={setPaymentMethod}
                disabled={isLoading}
              />
              
              {paymentMethod === "mpesa" && (
                <MpesaPaymentForm
                  phoneNumber={phoneNumber}
                  setPhoneNumber={setPhoneNumber}
                  email={email}
                  setEmail={setEmail}
                  isLoading={isLoading}
                />
              )}
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={handleClose} disabled={isLoading}>
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Processing..." : "Deposit Funds"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <PaymentIframeModal
        isOpen={isPaymentModalOpen}
        onClose={handlePaymentModalClose}
        paymentUrl={paymentUrl}
      />
    </>
  );
};

export default DepositModal;
