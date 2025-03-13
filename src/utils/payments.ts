
// Payment integration utilities for Pesapal

// Environment variables in Vite should be accessed using import.meta.env instead of process.env
export const PESAPAL_API_KEY = import.meta.env.VITE_PESAPAL_API_KEY || 'demo-key';
export const PESAPAL_API_SECRET = import.meta.env.VITE_PESAPAL_API_SECRET || 'demo-secret';
export const PESAPAL_API_URL = import.meta.env.VITE_PESAPAL_API_URL || 'https://pay.pesapal.com/v3';

// Payment methods
export const PAYMENT_METHODS = [
  { id: 'card', name: 'Card Payment', icon: 'credit-card' },
  { id: 'mpesa', name: 'M-Pesa', icon: 'smartphone' },
  { id: 'crypto', name: 'Cryptocurrency', icon: 'bitcoin' },
];

// Define return type for payment processing
interface PaymentResult {
  success: boolean;
  transactionId: string;
  amount: number;
  method: string;
  error?: string;
  redirectUrl?: string;
  orderTrackingId?: string;
}

// Pesapal Token Types
interface PesapalAuthToken {
  token: string;
  expiryTime: string;
}

interface PesapalOrderRequest {
  id: string;
  currency: string;
  amount: number;
  description: string;
  callback_url: string;
  notification_id: string;
  billing_address: {
    email_address: string;
    phone_number?: string;
    country_code?: string;
    first_name?: string;
    last_name?: string;
  };
}

interface PesapalOrderResponse {
  order_tracking_id: string;
  redirect_url: string;
  error?: {
    error_type: string;
    code: string;
    message: string;
  };
}

// Global token cache
let authToken: PesapalAuthToken | null = null;
let tokenExpiry: Date | null = null;

// Get auth token from Pesapal
const getPesapalToken = async (): Promise<string> => {
  // Check if we have a valid cached token
  if (authToken && tokenExpiry && new Date() < tokenExpiry) {
    return authToken.token;
  }

  try {
    const response = await fetch(`${PESAPAL_API_URL}/api/Auth/RequestToken`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        consumer_key: PESAPAL_API_KEY,
        consumer_secret: PESAPAL_API_SECRET,
      }),
    });

    if (!response.ok) {
      throw new Error(`Failed to get Pesapal token: ${response.statusText}`);
    }

    const data = await response.json();
    authToken = data as PesapalAuthToken;
    
    // Set token expiry time (typically 1 hour but we'll use 50 minutes to be safe)
    tokenExpiry = new Date(new Date().getTime() + 50 * 60 * 1000);
    
    return authToken.token;
  } catch (error) {
    console.error('Error getting Pesapal token:', error);
    throw error;
  }
};

// Submit order to Pesapal
const submitPesapalOrder = async (
  amount: number,
  email: string,
  phoneNumber?: string
): Promise<PesapalOrderResponse> => {
  try {
    const token = await getPesapalToken();
    
    const orderId = `ORDER-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
    const notificationId = import.meta.env.VITE_PESAPAL_NOTIFICATION_ID || 'default-notification';
    const callbackUrl = window.location.origin + '/dashboard'; // Redirect back to dashboard after payment
    
    const orderRequest: PesapalOrderRequest = {
      id: orderId,
      currency: 'USD',
      amount: formatAmount(amount),
      description: `Deposit to trading account - ${orderId}`,
      callback_url: callbackUrl,
      notification_id: notificationId,
      billing_address: {
        email_address: email,
        phone_number: phoneNumber,
        country_code: 'KE', // Default to Kenya for M-Pesa
      }
    };
    
    const response = await fetch(`${PESAPAL_API_URL}/api/Transactions/SubmitOrderRequest`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(orderRequest),
    });
    
    if (!response.ok) {
      throw new Error(`Failed to submit order: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error submitting Pesapal order:', error);
    throw error;
  }
};

// Process payment function
export const processPayment = async (
  amount: number | string, 
  method: string, 
  details: any
): Promise<PaymentResult> => {
  // Convert amount to number if it's a string
  const numericAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
  
  console.log(`Processing ${numericAmount} payment via ${method}`, details);
  
  try {
    // Check if we're in demo mode (no API keys provided)
    if (PESAPAL_API_KEY === 'demo-key' || PESAPAL_API_SECRET === 'demo-secret') {
      console.warn('Using demo mode. Set VITE_PESAPAL_API_KEY and VITE_PESAPAL_API_SECRET environment variables for production.');
      
      // Simulate an API call in demo mode
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            success: true,
            transactionId: `TX-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
            amount: numericAmount,
            method,
            redirectUrl: "https://pay.pesapal.com/demo-payment",
            orderTrackingId: `ORDER-${Math.random().toString(36).substr(2, 9).toUpperCase()}`
          });
        }, 2000);
      });
    }
    
    // For real integration, call the Pesapal API
    const orderResponse = await submitPesapalOrder(
      numericAmount,
      details.email,
      method === 'mpesa' ? details.phoneNumber : undefined
    );
    
    if (orderResponse.error) {
      return {
        success: false,
        transactionId: '',
        amount: numericAmount,
        method,
        error: orderResponse.error.message
      };
    }
    
    return {
      success: true,
      transactionId: `TX-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
      amount: numericAmount,
      method,
      redirectUrl: orderResponse.redirect_url,
      orderTrackingId: orderResponse.order_tracking_id
    };
  } catch (error) {
    console.error('Payment processing error:', error);
    return {
      success: false,
      transactionId: '',
      amount: numericAmount,
      method,
      error: error instanceof Error ? error.message : 'Unknown payment error'
    };
  }
};

// Check payment status function
export const checkPaymentStatus = async (orderTrackingId: string): Promise<string> => {
  console.log(`Checking payment status for order: ${orderTrackingId}`);
  
  try {
    // Check if we're in demo mode (no API keys provided)
    if (PESAPAL_API_KEY === 'demo-key' || PESAPAL_API_SECRET === 'demo-secret') {
      console.warn('Using demo mode. Set VITE_PESAPAL_API_KEY and VITE_PESAPAL_API_SECRET environment variables for production.');
      
      // Simulate API call to check payment status in demo mode
      return new Promise((resolve) => {
        setTimeout(() => {
          // For demonstration, randomly return a status
          const statuses = ["PENDING", "COMPLETED", "FAILED"];
          const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
          resolve(randomStatus);
        }, 1000);
      });
    }
    
    // For real integration, call the Pesapal API
    const token = await getPesapalToken();
    
    const response = await fetch(`${PESAPAL_API_URL}/api/Transactions/GetTransactionStatus?orderTrackingId=${orderTrackingId}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });
    
    if (!response.ok) {
      throw new Error(`Failed to check payment status: ${response.statusText}`);
    }
    
    const data = await response.json();
    
    // Map Pesapal status to our internal status
    const pesapalStatus = data.status_code || '';
    
    // Map Pesapal status codes to our status values
    // https://developer.pesapal.com/how-to-integrate/e-commerce/api-30-json/register-ipn
    switch (pesapalStatus) {
      case '1': // Pending
      case '2': // Processing
        return 'PENDING';
      case '0': // Completed
        return 'COMPLETED';
      case '3': // Failed
      case '4': // Failed
      default:
        return 'FAILED';
    }
  } catch (error) {
    console.error('Error checking payment status:', error);
    return 'FAILED';
  }
};

// Format amount to 2 decimal places
export const formatAmount = (amount: string | number): number => {
  const numericAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
  return parseFloat(numericAmount.toFixed(2));
};
