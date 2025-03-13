import { toast } from "@/hooks/use-toast";
import { Transaction } from "@/context/UserContext";
import axios from "axios";

// Store API Keys securely
const pesapalConfig = {
  consumerKey: process.env.PESAPAL_CONSUMER_KEY || 'RfjTb7Vfoa7ULQ757RmojeFWC8crRbyX',
  consumerSecret: process.env.PESAPAL_CONSUMER_SECRET || 'hzBxk/UrOi+FKbiy0tiEOhe4UN4=',
  apiUrl: 'https://www.pesapal.com/api',
  callbackUrl: 'https://vertex-trading.vercel.app/api/payments/callback',
  ipnUrl: "https://vertex-trading.vercel.app/api/payments/ipn",
  useSandbox: false,
  domain: "https://vertex-trading.vercel.app",
};

// Generate Bearer Token for API authentication
export const getPesapalToken = async (): Promise<string> => {
  const token = Buffer.from(`${pesapalConfig.consumerKey}:${pesapalConfig.consumerSecret}`).toString('base64');
  try {
    const response = await axios.post(`${pesapalConfig.apiUrl}/api/Auth/RequestToken`, {}, {
      headers: {
        Authorization: `Basic ${token}`,
        'Content-Type': 'application/json',
      },
    });
    return response.data.access_token;
  } catch (error) {
    console.error('Error fetching access token:', error);
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

// Submit payment request to Pesapal - unified function for all payment methods
export const submitPesapalPayment = async (
  paymentData: {
    amount: number;
    phoneNumber?: string;
    email?: string;
    description: string;
    transactionId: string;
    paymentMethod: string;
  }
) => {
  try {
    const token = await getPesapalToken(); // Retrieve access token
    
    // Prepare the base payment request
    const paymentRequest = {
      id: paymentData.transactionId,
      currency: "USD",
      amount: paymentData.amount,
      description: paymentData.description,
      callback_url: pesapalConfig.callbackUrl,
      notification_id: `notify-${Date.now()}`,
      billing_address: {
        phone_number: paymentData.phoneNumber || "",
        email_address: paymentData.email || "",
      },
    };
    
    // If it's a mobile payment, add the additional mobile payment details
    if (paymentData.paymentMethod === "mpesa") {
      Object.assign(paymentRequest, {
        mobile_payment: true,
        mobile_provider: "MPESA"
      });
    }
    
    const response = await axios.post(
      `${pesapalConfig.apiUrl}/api/Transactions/SubmitOrderRequest`,
      paymentRequest,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );
    
    return response.data;
  } catch (error) {
    console.error('Error submitting payment request:', error);
    throw error;
  }
};

// Process payment through PesaPal - unified flow for all payment methods
export const processPayment = async (
  amount: string,
  paymentMethod: string,
  phoneNumber: string = "",
  email: string = "",
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

    // Validate phone number for M-Pesa payments
    if (paymentMethod === "mpesa" && !validatePhoneNumber(phoneNumber)) {
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
    const paymentMethodDisplay = 
      paymentMethod === "mpesa" ? `M-Pesa (${phoneNumber})` :
      paymentMethod === "card" ? "Credit Card" : 
      paymentMethod === "crypto" ? "Crypto Wallet" : paymentMethod;
      
    addTransaction({
      amount: formattedAmount,
      type: "DEPOSIT",
      status: "PENDING",
      details: `Via ${paymentMethodDisplay} - Ref: ${transactionId}`,
    });

    toast({
      title: "Initializing Payment",
      description: "Connecting to Pesapal payment gateway...",
    });
    
    // Submit payment request
    const paymentResponse = await submitPesapalPayment({
      amount: formattedAmount,
      phoneNumber,
      email,
      description: `Deposit to Vertex Trading Account - $${formattedAmount}`,
      transactionId,
      paymentMethod
    });
    
    // Handle the Pesapal response
    if (paymentResponse && paymentResponse.redirect_url) {
      toast({
        title: "Payment Gateway Ready",
        description: `You'll be redirected to complete your payment with ${paymentMethodDisplay}.`,
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

// Replace the deprecated functions with redirects to the new unified function
export const processMpesaPayment = async (
  amount: string,
  phoneNumber: string,
  email: string,
  addTransaction: (transaction: Omit<Transaction, "id" | "timestamp">) => void
): Promise<{redirectUrl?: string; orderTrackingId?: string; error?: string}> => {
  return processPayment(amount, "mpesa", phoneNumber, email, addTransaction);
};

export const processOtherPayment = (
  amount: string,
  paymentMethod: string,
  addTransaction: (transaction: Omit<Transaction, "id" | "timestamp">) => void
): void => {
  processPayment(amount, paymentMethod, "", "", addTransaction)
    .then(() => {
      // Success is handled in the main function
    })
    .catch(error => {
      console.error("Error in processOtherPayment:", error);
    });
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
