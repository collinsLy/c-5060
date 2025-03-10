
import { toast } from "@/hooks/use-toast";
import { Transaction } from "@/context/UserContext";

// PesaPal configuration
export const pesapalConfig = {
  consumerKey: "RfjTb7Vfoa7ULQ757RmojeFWC8crRbyX",
  consumerSecret: "hzBxk/UrOi+FKbiy0tiEOhe4UN4=",
  domain: "vertex-trading.com", // Domain registered with PesaPal
  ipnListenerUrl: "https://vertex-trading.com/api/payments/ipn", // URL to receive payment notifications
  callbackUrl: "https://vertex-trading.com/dashboard", // URL to redirect after payment
};

// Process M-Pesa payment through PesaPal
export const processMpesaPayment = async (
  amount: string,
  phoneNumber: string,
  addTransaction: (transaction: Omit<Transaction, "id" | "timestamp">) => void
): Promise<void> => {
  try {
    console.log("Processing M-Pesa payment with PesaPal:", {
      amount,
      phoneNumber,
      ...pesapalConfig,
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
      description:
        "You should receive an M-Pesa prompt on your phone shortly. Please check your phone and enter your PIN to complete the transaction.",
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
        description: `Your deposit of $${parseFloat(amount).toFixed(
          2
        )} via M-Pesa has been received.`,
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
    throw error;
  }
};

// Process other payment methods (credit card, crypto)
export const processOtherPayment = (
  amount: string,
  paymentMethod: string,
  addTransaction: (transaction: Omit<Transaction, "id" | "timestamp">) => void
): void => {
  addTransaction({
    amount: parseFloat(amount),
    type: "DEPOSIT",
    status: "COMPLETED",
    details: `Via ${paymentMethod === "card" ? "Credit Card" : "Crypto Wallet"}`,
  });

  toast({
    title: "Deposit Successful",
    description: "Your deposit has been processed successfully.",
  });
};
