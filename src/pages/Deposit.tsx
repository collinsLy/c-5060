
import React, { useState } from "react";
import AuthLayout from "@/components/layout/AuthLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useUser } from "@/context/UserContext";
import { toast } from "@/hooks/use-toast";
import { formatAmount } from "@/utils/payments";
import PaymentMethodSelector from "@/components/deposit/PaymentMethodSelector";
import CardPaymentForm from "@/components/deposit/CardPaymentForm";
import CryptoPaymentForm from "@/components/deposit/CryptoPaymentForm";
import MpesaPaymentForm from "@/components/deposit/MpesaPaymentForm";
import { 
  processPayment,
  checkPaymentStatus 
} from "@/utils/payments";

const Deposit = () => {
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
  React.useEffect(() => {
    if (redirectUrl) {
      const timer = setTimeout(() => {
        window.location.href = redirectUrl;
      }, 2000);
      
      return () => clearTimeout(timer);
    }
  }, [redirectUrl]);

  // Poll for payment status updates if we have an orderTrackingId
  React.useEffect(() => {
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
            setAmount("");
            setPhoneNumber("");
            setEmail("");
            
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
  }, [orderTrackingId, amount, addTransaction, paymentMethod]);

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
      // Call the processPayment function with the correct parameters
      const result = await processPayment(
        parseFloat(amount), 
        paymentMethod, 
        { phoneNumber, email }
      );
      
      const typedResult = result as any; // Type assertion for the result
      
      if (typedResult.error) {
        setTransactionStatus(`Error: ${typedResult.error}`);
        setIsLoading(false);
      } else if (typedResult.redirectUrl && typedResult.orderTrackingId) {
        setOrderTrackingId(typedResult.orderTrackingId);
        setRedirectUrl(typedResult.redirectUrl);
        setTransactionStatus("Redirecting to Pesapal payment gateway...");
      } else {
        // Direct success (unlikely with Pesapal integration, but kept for compatibility)
        setAmount("");
        setTransactionStatus("");
        setIsLoading(false);
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

  return (
    <AuthLayout title="Deposit Funds">
      <div className="max-w-lg mx-auto bg-card rounded-lg shadow-sm p-6">
        <h2 className="text-2xl font-semibold mb-6">Add funds to your account</h2>
        
        <form onSubmit={handleSubmit}>
          <div className="grid gap-6">
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
            
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Processing..." : "Deposit Funds"}
            </Button>
          </div>
        </form>
      </div>
    </AuthLayout>
  );
};

export default Deposit;
