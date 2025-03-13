
import React, { useState, useEffect } from "react";
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
import { 
  processPayment,
  checkPaymentStatus 
} from "@/utils/payments";

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
  const [email, setEmail] = useState<string>("");
  const [transactionStatus, setTransactionStatus] = useState<string>("");
  const [orderTrackingId, setOrderTrackingId] = useState<string>("");
  const [redirectUrl, setRedirectUrl] = useState<string>("");

  // Handle redirect to Pesapal payment page
  useEffect(() => {
    if (redirectUrl) {
      const timer = setTimeout(() => {
        window.location.href = redirectUrl;
      }, 2000);
      
      return () => clearTimeout(timer);
    }
  }, [redirectUrl]);

  // Poll for payment status updates if we have an orderTrackingId
  useEffect(() => {
    let statusCheckInterval: number | undefined;
    
    if (orderTrackingId) {
      statusCheckInterval = window.setInterval(async () => {
        try {
          const status = await checkPaymentStatus(orderTrackingId);
          
          if (status === "COMPLETED") {
            toast({
              title: "Payment Successful",
              description: "Your deposit has been completed successfully.",
            });
            
            // Update transaction status to COMPLETED
            const paymentMethodDisplay = 
              paymentMethod === "mpesa" ? `M-Pesa` :
              paymentMethod === "card" ? "Credit Card" : 
              paymentMethod === "crypto" ? "Crypto Wallet" : paymentMethod;
              
            addTransaction({
              amount: parseFloat(amount),
              type: "DEPOSIT",
              status: "COMPLETED",
              details: `${paymentMethodDisplay} payment completed - Ref: ${orderTrackingId}`,
            });
            
            setIsLoading(false);
            setTransactionStatus("");
            setOrderTrackingId("");
            onClose();
            
            clearInterval(statusCheckInterval);
          } else if (status === "FAILED") {
            toast({
              title: "Payment Failed",
              description: "Your payment could not be processed. Please try again.",
              variant: "destructive",
            });
            
            setIsLoading(false);
            setTransactionStatus("Payment failed. Please try again.");
            setOrderTrackingId("");
            
            clearInterval(statusCheckInterval);
          }
        } catch (error) {
          console.error("Error checking payment status:", error);
        }
      }, 10000); // Check every 10 seconds
    }
    
    return () => {
      if (statusCheckInterval) {
        clearInterval(statusCheckInterval);
      }
    };
  }, [orderTrackingId, amount, addTransaction, onClose, paymentMethod]);

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
    setTransactionStatus("Processing payment...");
    
    try {
      // Prepare the details object
      const details = paymentMethod === 'mpesa' 
        ? { phoneNumber, email } 
        : { email };
      
      // Use unified payment processing function
      const result = await processPayment(amount, paymentMethod, details);
      
      if (result.error) {
        setTransactionStatus(`Error: ${result.error}`);
        setIsLoading(false);
      } else if (result.redirectUrl && result.orderTrackingId) {
        setOrderTrackingId(result.orderTrackingId);
        setRedirectUrl(result.redirectUrl);
        setTransactionStatus("Redirecting to Pesapal payment gateway...");
      } else {
        // Direct success
        addTransaction({
          amount: parseFloat(amount),
          type: "DEPOSIT",
          status: "COMPLETED",
          details: `${paymentMethod} payment completed - Ref: ${result.transactionId}`,
        });
        
        toast({
          title: "Payment Successful",
          description: "Your deposit has been completed successfully.",
        });
        
        setAmount("");
        setTransactionStatus("");
        onClose();
      }
    } catch (error) {
      console.error("Payment processing error:", error);
      setTransactionStatus("");
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
            email={email}
            setEmail={setEmail}
            isLoading={isLoading}
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
      setEmail("");
      setTransactionStatus("");
      setOrderTrackingId("");
      setRedirectUrl("");
      onClose();
    } else {
      // Confirm before closing if a transaction is in progress
      const confirmClose = window.confirm("A transaction is in progress. Are you sure you want to close this window?");
      if (confirmClose) {
        setIsLoading(false);
        setTransactionStatus("");
        setOrderTrackingId("");
        setRedirectUrl("");
        onClose();
      }
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
            
            {transactionStatus && (
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-md text-blue-800 text-sm">
                <p>{transactionStatus}</p>
              </div>
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
  );
};

export default DepositModal;
