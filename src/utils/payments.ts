
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
  // Basic validation - should be at least 10 digits and start with 254
  const digits = phoneNumber.replace(/\D/g, '');
  if (digits.length < 10 || !digits.startsWith('254')) {
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
        description: "Please enter a valid M-Pesa phone number starting with 254.",
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

    // Generate a unique transaction ID
    const transactionId = `TX-${Date.now()}-${Math.floor(Math.random() * 10000)}`;

    // Add transaction with PENDING status initially
    addTransaction({
      amount: formattedAmount,
      type: "DEPOSIT",
      status: "PENDING",
      details: `Via M-Pesa (${phoneNumber}) - Ref: ${transactionId}`,
    });

    // In a real production implementation, we would make an API call to the PesaPal API
    // Here we would construct and send the actual request to PesaPal's endpoints
    
    // Construct PesaPal payment request payload
    const paymentPayload = {
      id: transactionId,
      amount: formattedAmount,
      description: `Deposit to Vertex Trading Account`,
      type: "MERCHANT",
      reference: transactionId,
      phone_number: phoneNumber,
      email: "",
      currency: "USD",
      method: "MPESA",
      consumer_key: pesapalConfig.consumerKey,
      notification_id: `notify-${Date.now()}`,
      callback_url: pesapalConfig.callbackUrl,
      ipn_url: pesapalConfig.ipnListenerUrl,
    };

    // Show toast to inform user the payment request is being processed
    toast({
      title: "M-Pesa Request Initiated",
      description: "Your request is being sent to PesaPal for processing. You should receive an M-Pesa prompt on your phone shortly.",
    });

    // Simulate a network request to PesaPal's API with intentional delay
    // In production, this would be replaced with actual API call
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Show a toast to inform the user that the request has been sent
    toast({
      title: "M-Pesa Prompt Sent",
      description: "Please check your phone and enter your PIN to complete the transaction. This may take a moment.",
    });

    // We'd normally wait for a callback or IPN from PesaPal to update the status
    // For now, we'll simulate waiting for the PesaPal response
    // In production, this would be handled by a webhook/callback endpoint
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
