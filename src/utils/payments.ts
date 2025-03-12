
import { toast } from "@/hooks/use-toast";
import { Transaction } from "@/context/UserContext";

// PesaPal configuration
export const pesapalConfig = {
  consumerKey: "RfjTb7Vfoa7ULQ757RmojeFWC8crRbyX",
  consumerSecret: "hzBxk/UrOi+FKbiy0tiEOhe4UN4=",
  domain: "https://vertex-trading.vercel.app", // Domain
  ipnListenerUrl: "https://vertex-trading.vercel.app/api/payments/ipn", // IPN URL
  callbackUrl: "https://vertex-trading.vercel.app/dashboard", // Callback URL
};

// Validate phone number format
export const validatePhoneNumber = (phoneNumber: string): boolean => {
  // Basic validation - should be at least 10 digits
  const digits = phoneNumber.replace(/\D/g, '');
  if (digits.length < 10) {
    return false;
  }
  return true;
};

// Format amount to 2 decimal places
export const formatAmount = (amount: string | number): number => {
  const numericAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
  return parseFloat(numericAmount.toFixed(2));
};

// Process M-Pesa payment through PesaPal
export const processMpesaPayment = async (
  amount: string,
  phoneNumber: string,
  addTransaction: (transaction: Omit<Transaction, "id" | "timestamp">) => void
): Promise<void> => {
  try {
    // Validate amount
    const numericAmount = parseFloat(amount);
    if (isNaN(numericAmount) || numericAmount <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid deposit amount.",
        variant: "destructive",
      });
      throw new Error("Invalid amount");
    }

    // Validate phone number
    if (!validatePhoneNumber(phoneNumber)) {
      toast({
        title: "Invalid Phone Number",
        description: "Please enter a valid M-Pesa phone number.",
        variant: "destructive",
      });
      throw new Error("Invalid phone number");
    }

    // Format amount to 2 decimal places
    const formattedAmount = formatAmount(amount);

    console.log("Processing M-Pesa payment with PesaPal:", {
      amount: formattedAmount,
      phoneNumber,
      ...pesapalConfig,
    });

    // Add transaction with PENDING status initially
    const transactionId = `order-${Date.now()}`;
    addTransaction({
      amount: formattedAmount,
      type: "DEPOSIT",
      status: "PENDING",
      details: `Via M-Pesa (${phoneNumber}) - Ref: ${transactionId}`,
    });

    // In a real-world implementation, we would make an API call to the PesaPal API
    // For this implementation, we'll simulate the API call with the following fields:
    const orderInfo = {
      id: transactionId,
      amount: formattedAmount,
      description: `Deposit to Vertex Trading Account`,
      payment_method: "mpesa",
      phone_number: phoneNumber,
      currency: "USD",
      callback_url: pesapalConfig.callbackUrl,
      notification_id: `notify-${Date.now()}`,
      consumer_key: pesapalConfig.consumerKey,
      consumer_secret: pesapalConfig.consumerSecret,
    };

    // Show a toast to inform the user that the request has been sent
    toast({
      title: "M-Pesa Request Initiated",
      description:
        "You should receive an M-Pesa prompt on your phone shortly. Please check your phone and enter your PIN to complete the transaction.",
    });

    // For demo purposes, we'll simulate a successful payment after 5 seconds
    // In a production environment, this would be handled by the PesaPal IPN
    setTimeout(() => {
      toast({
        title: "Payment Successful",
        description: `Your deposit of $${formattedAmount.toFixed(
          2
        )} via M-Pesa has been received.`,
      });

      // Update the transaction to COMPLETED
      addTransaction({
        amount: formattedAmount,
        type: "DEPOSIT",
        status: "COMPLETED",
        details: `Via M-Pesa (${phoneNumber}) - Ref: ${transactionId}`,
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
  try {
    // Validate amount
    const numericAmount = parseFloat(amount);
    if (isNaN(numericAmount) || numericAmount <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid deposit amount.",
        variant: "destructive",
      });
      return;
    }

    // Format amount to 2 decimal places
    const formattedAmount = formatAmount(amount);

    addTransaction({
      amount: formattedAmount,
      type: "DEPOSIT",
      status: "COMPLETED",
      details: `Via ${paymentMethod === "card" ? "Credit Card" : "Crypto Wallet"}`,
    });

    toast({
      title: "Deposit Successful",
      description: `Your deposit of $${formattedAmount.toFixed(2)} has been processed successfully.`,
    });
  } catch (error) {
    console.error("Error processing payment:", error);
    toast({
      title: "Payment Error",
      description: "There was an error processing your payment. Please try again.",
      variant: "destructive",
    });
  }
};
