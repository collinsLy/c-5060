
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
import CardPaymentForm from "@/components/deposit/CardPaymentForm";
import CryptoPaymentForm from "@/components/deposit/CryptoPaymentForm";
import MpesaPaymentForm from "@/components/deposit/MpesaPaymentForm";
import PaymentMethodSelector from "@/components/deposit/PaymentMethodSelector";
import { processMpesaPayment, processOtherPayment, validatePhoneNumber } from "@/utils/payments";

interface DepositModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const DepositModal: React.FC<DepositModalProps> = ({ isOpen, onClose }) => {
  const { addTransaction, balance } = useUser();
  const [amount, setAmount] = useState<string>("");
  const [paymentMethod, setPaymentMethod] = useState<string>("card");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [phoneNumber, setPhoneNumber] = useState<string>("");

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

    // Validate M-Pesa phone number if that's the selected payment method
    if (paymentMethod === "mpesa") {
      if (!validatePhoneNumber(phoneNumber)) {
        toast({
          title: "Invalid Phone Number",
          description: "Please enter a valid M-Pesa phone number.",
          variant: "destructive",
        });
        return false;
      }
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
      if (paymentMethod === "mpesa") {
        await processMpesaPayment(amount, phoneNumber, addTransaction);
      } else {
        processOtherPayment(amount, paymentMethod, addTransaction);
      }
      
      if (paymentMethod !== "mpesa") {
        setAmount("");
        setPhoneNumber("");
        onClose();
      } else {
        setTimeout(() => {
          setIsLoading(false);
        }, 2000);
      }
    } catch (error) {
      console.error("Payment processing error:", error);
      setIsLoading(false);
    }
  };

  const renderPaymentForm = () => {
    switch (paymentMethod) {
      case "card":
        return <CardPaymentForm />;
      case "crypto":
        return <CryptoPaymentForm />;
      case "mpesa":
        return (
          <MpesaPaymentForm
            phoneNumber={phoneNumber}
            setPhoneNumber={setPhoneNumber}
          />
        );
      default:
        return null;
    }
  };

  const handleClose = () => {
    if (!isLoading) {
      setAmount("");
      setPhoneNumber("");
      onClose();
    }
  };

  return (
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
            
            {renderPaymentForm()}
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
  );
};

export default DepositModal;
