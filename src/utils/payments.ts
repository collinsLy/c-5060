import { toast } from "@/hooks/use-toast";
import { Transaction } from "@/context/UserContext";
import axios from "axios";

// PesaPal configuration
export const pesapalConfig = {
  // Live credentials
  liveConsumerKey: "RfjTb7Vfoa7ULQ757RmojeFWC8crRbyX",
  liveConsumerSecret: "hzBxk/UrOi+FKbiy0tiEOhe4UN4=",
  
  // Sandbox credentials
  sandboxConsumerKey: "qkio1BGGYAXTu2JOfm7XSXNruoZsrqEW",
  sandboxConsumerSecret: "osGQ364R49cXKeOYSpaOnT++rHs=",
  
  // Use live environment by default (can be toggled for testing)
  useSandbox: false,
  
  // Domain and callback URLs
  domain: "https://vertex-trading.vercel.app",
  callbackUrl: "https://vertex-trading.vercel.app/dashboard", 
  ipnUrl: "https://vertex-trading.vercel.app/api/payments/ipn",
  
  // API endpoints
  get apiUrl() {
    return this.useSandbox 
      ? "https://cybqa.pesapal.com/pesapalv3" 
      : "https://pay.pesapal.com/v3";
  },
  
  // Get current environment credentials
  get consumerKey() {
    return this.useSandbox ? this.sandboxConsumerKey : this.liveConsumerKey;
  },
  
  get consumerSecret() {
    return this.useSandbox ? this.sandboxConsumerSecret : this.liveConsumerSecret;
  }
};

// Generate Bearer Token for API authentication
export const getPesapalToken = async () => {
  try {
    const response = await axios.post(
      `${pesapalConfig.apiUrl}/api/Auth/RequestToken`,
      {
        consumer_key: pesapalConfig.consumerKey,
        consumer_secret: pesapalConfig.consumerSecret
      }
    );
    
    if (response.data && response.data.token) {
      return response.data.token;
    } else {
      throw new Error("Failed to get authentication token");
    }
  } catch (error) {
    console.error("Error getting Pesapal token:", error);
    throw error;
  }
};

// Register IPN URL with Pesapal
export const registerIPNUrl = async (token: string) => {
  try {
    const response = await axios.post(
      `${pesapalConfig.apiUrl}/api/URLSetup/RegisterIPN`,
      {
        url: pesapalConfig.ipnUrl,
        ipn_notification_type: "GET"
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      }
    );
    
    return response.data;
  } catch (error) {
    console.error("Error registering IPN URL:", error);
    throw error;
  }
};

// Submit payment request to Pesapal
export const submitPesapalPaymentRequest = async (
  token: string,
  paymentData: {
    amount: number;
    phoneNumber: string;
    email: string;
    description: string;
    transactionId: string;
  }
) => {
  try {
    const response = await axios.post(
      `${pesapalConfig.apiUrl}/api/Transactions/SubmitOrderRequest`,
      {
        id: paymentData.transactionId,
        currency: "USD",
        amount: paymentData.amount,
        description: paymentData.description,
        callback_url: pesapalConfig.callbackUrl,
        notification_id: `notify-${Date.now()}`,
        billing_address: {
          phone_number: paymentData.phoneNumber,
          email_address: paymentData.email || "",
        }
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      }
    );
    
    return response.data;
  } catch (error) {
    console.error("Error submitting payment request:", error);
    throw error;
  }
};

// Process M-Pesa payment through PesaPal
export const processMpesaPayment = async (
  amount: string,
  phoneNumber: string,
  email: string,
  addTransaction: (transaction: Omit<Transaction, "id" | "timestamp">) => void
): Promise<{redirectUrl?: string; orderTrackingId?: string; error?: string}> => {
  try {
    // Validate amount
    const numericAmount = parseFloat(amount);
    if (isNaN(numericAmount) || numericAmount <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid deposit amount.",
        variant: "destructive",
      });
      return {error: "Invalid amount"};
    }

    // Validate phone number
    if (!validatePhoneNumber(phoneNumber)) {
      toast({
        title: "Invalid Phone Number",
        description: "Please enter a valid M-Pesa phone number starting with 254.",
        variant: "destructive",
      });
      return {error: "Invalid phone number"};
    }

    // Format amount to 2 decimal places
    const formattedAmount = formatAmount(amount);

    // Generate a unique transaction ID
    const transactionId = `TX-${Date.now()}-${Math.floor(Math.random() * 10000)}`;

    // Add transaction with PENDING status initially
    addTransaction({
      amount: formattedAmount,
      type: "DEPOSIT",
      status: "PENDING",
      details: `Via M-Pesa (${phoneNumber}) - Ref: ${transactionId}`,
    });

    toast({
      title: "Initializing Payment",
      description: "Connecting to Pesapal payment gateway...",
    });

    // Get authentication token
    const token = await getPesapalToken();
    
    // Register IPN URL (this would typically be done once during app setup)
    // await registerIPNUrl(token);
    
    // Submit payment request
    const paymentResponse = await submitPesapalPaymentRequest(token, {
      amount: formattedAmount,
      phoneNumber,
      email: email || "",
      description: `Deposit to Vertex Trading Account - $${formattedAmount}`,
      transactionId
    });
    
    // Handle the Pesapal response
    if (paymentResponse && paymentResponse.redirect_url) {
      toast({
        title: "Payment Gateway Ready",
        description: "You'll be redirected to complete your payment with M-Pesa.",
      });
      
      return {
        redirectUrl: paymentResponse.redirect_url,
        orderTrackingId: paymentResponse.order_tracking_id
      };
    } else {
      throw new Error("Payment initialization failed");
    }
  } catch (error) {
    console.error("Error processing payment:", error);
    toast({
      title: "Payment Error",
      description: "There was an error connecting to the payment gateway. Please try again.",
      variant: "destructive",
    });
    return {error: error instanceof Error ? error.message : "Unknown error"};
  }
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

// Check payment status
export const checkPaymentStatus = async (orderTrackingId: string): Promise<string> => {
  try {
    const token = await getPesapalToken();
    
    const response = await axios.get(
      `${pesapalConfig.apiUrl}/api/Transactions/GetTransactionStatus?orderTrackingId=${orderTrackingId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      }
    );
    
    if (response.data && response.data.status_code) {
      return response.data.status_code;
    }
    
    return "PENDING";
  } catch (error) {
    console.error("Error checking payment status:", error);
    return "ERROR";
  }
};
