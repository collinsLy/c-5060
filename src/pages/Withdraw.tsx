
import React, { useState } from "react";
import AuthLayout from "@/components/layout/AuthLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useUser } from "@/context/UserContext";
import { toast } from "@/hooks/use-toast";
import { formatAmount } from "@/utils/payments";

const Withdraw = () => {
  const { addTransaction, setBalance, balance } = useUser();
  const [amount, setAmount] = useState<string>("");
  const [account, setAccount] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // When using formatAmount, make sure to pass a number
  const formattedAmount = formatAmount(parseFloat(amount) || 0);

  const validateForm = (): boolean => {
    if (!amount || isNaN(parseFloat(amount)) || parseFloat(amount) <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid withdrawal amount.",
        variant: "destructive",
      });
      return false;
    }

    if (parseFloat(amount) > balance) {
      toast({
        title: "Insufficient Balance",
        description: "You do not have sufficient balance to make this withdrawal.",
        variant: "destructive",
      });
      return false;
    }

    if (!account) {
      toast({
        title: "Missing Account Details",
        description: "Please enter your withdrawal account details.",
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
      // Make sure to convert amount to number
      const parsedAmount = parseFloat(amount);
      
      // Simulate withdrawal processing (replace with actual API call)
      await new Promise((resolve) => setTimeout(resolve, 1500));
      
      // Update user balance and add transaction record
      addTransaction({
        amount: parsedAmount, // Use the parsed number value
        type: "WITHDRAWAL",
        status: "COMPLETED",
        details: `Withdrawal to ${account} completed`,
      });
      
      setBalance(balance - parsedAmount);
      
      toast({
        title: "Withdrawal Successful",
        description: `Withdrawal of ${formattedAmount} to ${account} completed.`,
      });
      
      setAmount("");
      setAccount("");
    } catch (error) {
      console.error("Withdrawal error:", error);
      toast({
        title: "Withdrawal Failed",
        description: "There was an error processing your withdrawal. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout title="Withdraw Funds">
      <div className="max-w-lg mx-auto bg-card rounded-lg shadow-sm p-6">
        <h2 className="text-2xl font-semibold mb-6">Withdraw funds from your account</h2>
        
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
            
            <div className="grid gap-2">
              <Label htmlFor="account">Account Details</Label>
              <Input
                id="account"
                type="text"
                value={account}
                onChange={(e) => setAccount(e.target.value)}
                placeholder="Enter account details"
                className="bg-background/50"
                required
                disabled={isLoading}
              />
            </div>
            
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Processing..." : "Withdraw Funds"}
            </Button>
          </div>
        </form>
      </div>
    </AuthLayout>
  );
};

export default Withdraw;
