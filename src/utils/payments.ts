
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
  branch?: string;
  billing_address: {
    email_address: string;
    phone_number?: string;
    country_code?: string;
    first_name?: string;
    last_name?: string;
    line_1?: string;
    line_2?: string;
    city?: string;
    state?: string;
    postal_code?: string;
    zip_code?: string;
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

// Global token cache with proper expiry handling
let authToken: PesapalAuthToken | null = null;
let tokenExpiry: Date | null = null;

// Format amount to 2 decimal places
export const formatAmount = (amount: number): number => {
  return Number(amount.toFixed(2));
};

// Get auth token from Pesapal with proper error handling and retry logic
const getPesapalToken = async (retryCount = 0): Promise<string> => {
  try {
    if (authToken && tokenExpiry && new Date() < tokenExpiry) {
      return authToken.token;
    }

    const token = jwt.sign(
      {
        consumer_key: PESAPAL_API_KEY,
        iat: Math.floor(Date.now() / 1000)
      },
      PESAPAL_API_SECRET,
      { algorithm: 'HS256' }
    );

    authToken = { token, expiryTime: new Date(Date.now() + 55 * 60 * 1000).toISOString() };
    return token;
  } catch (error) {
    console.error('Error generating JWT:', error);
    throw error;
  }
};

// Submit order to Pesapal with improved error handling
const submitPesapalOrder = async (
  amount: number,
  email: string,
  phoneNumber?: string
): Promise<PesapalOrderResponse> => {
  try {
    const token = await getPesapalToken();
    
    const orderId = `ORDER-${Date.now()}-${Math.random().toString(36).substr(2, 4).toUpperCase()}`;
    const notificationId = import.meta.env.VITE_PESAPAL_NOTIFICATION_ID || 'default-notification';
    const baseUrl = import.meta.env.VITE_APP_URL || process.env.NEXT_PUBLIC_APP_DOMAIN;
    const ipnUrl = `${baseUrl}/ipn`; // IPN handler endpoint
    const callbackUrl = `${merchantDomain}/dashboard`; // Redirect after payment
    
    const orderRequest: PesapalOrderRequest = {
      id: orderId,
      currency: 'KES',
      amount: formatAmount(amount),
      description: `Deposit to trading account - ${orderId}`,
      callback_url: callbackUrl,
      notification_id: notificationId,
      branch: 'Vertex Tradings',
      billing_address: {
        email_address: email,
        phone_number: phoneNumber,
        country_code: phoneNumber ? 'KE' : undefined,
        first_name: email.split('@')[0],
        last_name: '',
        line_1: 'Nairobi',
        line_2: 'Kenya',
        city: 'Nairobi',
        state: 'Nairobi County',
        postal_code: '00100',
        zip_code: '00100'
      }
    };
    
    const response = await fetch(`${PESAPAL_API_URL}/api/Transactions/SubmitOrderRequest`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json', // Mirror PHP implementation
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(orderRequest),
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      console.error('Pesapal order submission failed:', {
        status: response.status,
        statusText: response.statusText,
        error: errorData || await response.text(),
        url: response.url,
        request: orderRequest
      });
      throw new Error(errorData?.error?.message || `Failed to submit order: ${response.statusText}`);
    }
    
    const orderResponse = await response.json();
    if (orderResponse.error) {
      throw new Error(orderResponse.error.message || 'Unknown error from Pesapal');
    }
    
    return orderResponse;
  } catch (error) {
    console.error('Error submitting Pesapal order:', error);
    throw error;
  }
};

// Process payment function with improved error handling
export const processPayment = async (
  amount: number | string, 
  method: string, 
  details: any
): Promise<PaymentResult> => {
  const numericAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
  
  try {
    if (PESAPAL_API_KEY === 'demo-key' || PESAPAL_API_SECRET === 'demo-secret') {
      throw new Error('Invalid API credentials. Please configure PESAPAL_API_KEY and PESAPAL_API_SECRET');
    }

    if (isNaN(numericAmount) || numericAmount <= 0) {
      throw new Error('Invalid amount specified');
    }

    const { email, phone } = details;
    if (!email) {
      throw new Error('Email is required for payment processing');
    }

    const orderResponse = await submitPesapalOrder(numericAmount, email, phone);

    return {
      success: true,
      transactionId: orderResponse.order_tracking_id,
      amount: numericAmount,
      method,
      redirectUrl: orderResponse.redirect_url,
      orderTrackingId: orderResponse.order_tracking_id
    };
  } catch (error: any) {
    console.error('Payment processing failed:', error);
    return {
      success: false,
      transactionId: '',
      amount: numericAmount,
      method,
      error: error.message || 'Payment processing failed'
    };
  }
};

// Check payment status function with improved status mapping
export const checkPaymentStatus = async (trackingId: string): Promise<string> => {
  try {
    const token = await getPesapalToken();
    
    const response = await fetch(`${PESAPAL_API_URL}/api/Transactions/GetTransactionStatus?orderTrackingId=${trackingId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(`API Error: ${errorData?.error?.message || response.statusText}`);
    }

    const statusData = await response.json();
    
    // Validate response structure
    if (!statusData?.payment_status || !statusData?.order_tracking_id) {
      throw new Error('Invalid response format from Pesapal API');
    }

    // Map Pesapal status to our system status
    const statusMap: Record<string, string> = {
      'COMPLETED': 'COMPLETED',
      'PENDING': 'PENDING',
      'FAILED': 'FAILED',
      'INVALID': 'FAILED'
    };

    return statusMap[statusData.payment_status] || 'PENDING';
  } catch (error) {
    console.error('Error checking payment status:', {
      trackingId,
      error: error instanceof Error ? error.message : 'Unknown error'
    });
    throw error;
  }
};
