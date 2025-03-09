
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

interface WithdrawModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const WithdrawModal: React.FC<WithdrawModalProps> = ({ isOpen, onClose }) => {
  const { balance, addTransaction } = useUser();
  const [amount, setAmount] = useState<string>("");
  const [walletAddress, setWalletAddress] = useState<string>("");
  const [withdrawalMethod, setWithdrawalMethod] = useState<string>("crypto");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const withdrawalAmount = parseFloat(amount);
    
    if (!amount || withdrawalAmount <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid withdrawal amount.",
        variant: "destructive",
      });
      return;
    }
    
    if (withdrawalAmount > balance) {
      toast({
        title: "Insufficient Funds",
        description: "You don't have enough funds to withdraw this amount.",
        variant: "destructive",
      });
      return;
    }
    
    if (!walletAddress) {
      toast({
        title: "Missing Wallet Address",
        description: "Please enter a wallet address for your withdrawal.",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    
    // Simulate processing
    await new Promise((resolve) => setTimeout(resolve, 1500));
    
    // Add transaction to history
    addTransaction({
      amount: withdrawalAmount,
      type: "WITHDRAWAL",
      status: "COMPLETED",
      details: `To: ${walletAddress.substring(0, 8)}...`,
    });
    
    setIsLoading(false);
    setAmount("");
    setWalletAddress("");
    onClose();
  };

  const handleMax = () => {
    setAmount(balance.toString());
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] bg-card text-foreground">
        <DialogHeader>
          <DialogTitle>Withdraw Funds</DialogTitle>
          <DialogDescription>
            Withdraw funds from your Vertex Trading account.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="amount">Amount (USD)</Label>
                <span className="text-sm text-muted-foreground">
                  Available: ${balance.toFixed(2)}
                </span>
              </div>
              <div className="relative">
                <Input
                  id="amount"
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="Enter amount"
                  min="1"
                  step="0.01"
                  className="bg-background/50 pr-16"
                  required
                />
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  className="absolute right-1 top-1 h-7"
                  onClick={handleMax}
                >
                  Max
                </Button>
              </div>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="withdrawal-method">Withdrawal Method</Label>
              <div className="flex gap-4">
                <Button
                  type="button"
                  variant={withdrawalMethod === "crypto" ? "default" : "outline"}
                  onClick={() => setWithdrawalMethod("crypto")}
                  className="flex-1"
                >
                  Crypto
                </Button>
                <Button
                  type="button"
                  variant={withdrawalMethod === "bank" ? "default" : "outline"}
                  onClick={() => setWithdrawalMethod("bank")}
                  className="flex-1"
                >
                  Bank Transfer
                </Button>
              </div>
            </div>
            
            {withdrawalMethod === "crypto" && (
              <div className="grid gap-2">
                <Label htmlFor="wallet-address">Wallet Address</Label>
                <Input
                  id="wallet-address"
                  type="text"
                  value={walletAddress}
                  onChange={(e) => setWalletAddress(e.target.value)}
                  placeholder="Enter your wallet address"
                  className="bg-background/50"
                  required
                />
                <div className="grid gap-2">
                  <Label htmlFor="crypto-type">Select Cryptocurrency</Label>
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
              </div>
            )}
            
            {withdrawalMethod === "bank" && (
              <div className="grid gap-2">
                <Label htmlFor="bank-name">Bank Name</Label>
                <Input
                  id="bank-name"
                  type="text"
                  placeholder="Enter bank name"
                  className="bg-background/50"
                  required
                />
                <Label htmlFor="account-number">Account Number</Label>
                <Input
                  id="account-number"
                  type="text"
                  placeholder="Enter account number"
                  className="bg-background/50"
                  required
                />
                <Label htmlFor="routing-number">Routing Number</Label>
                <Input
                  id="routing-number"
                  type="text"
                  placeholder="Enter routing number"
                  className="bg-background/50"
                  required
                />
              </div>
            )}
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Processing..." : "Withdraw Funds"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default WithdrawModal;
