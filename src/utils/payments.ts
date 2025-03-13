
// Payment integration utilities

// Environment variables in Vite should be accessed using import.meta.env instead of process.env
export const PESAPAL_API_KEY = import.meta.env.VITE_PESAPAL_API_KEY || 'demo-key';
export const PESAPAL_API_SECRET = import.meta.env.VITE_PESAPAL_API_SECRET || 'demo-secret';

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

// Process payment function
export const processPayment = async (
  amount: number | string, 
  method: string, 
  details: any
): Promise<PaymentResult> => {
  // Convert amount to number if it's a string
  const numericAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
  
  // This is a placeholder for actual payment processing
  console.log(`Processing ${numericAmount} payment via ${method}`, details);
  
  // Simulate API call
  return new Promise((resolve) => {
    setTimeout(() => {
      // For demonstration purposes, randomly decide if we're going to redirect or process directly
      const shouldRedirect = Math.random() > 0.5;
      
      if (shouldRedirect) {
        resolve({
          success: true,
          transactionId: `TX-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
          amount: numericAmount,
          method,
          redirectUrl: "https://pay.pesapal.com/demo-payment",
          orderTrackingId: `ORDER-${Math.random().toString(36).substr(2, 9).toUpperCase()}`
        });
      } else {
        resolve({
          success: true,
          transactionId: `TX-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
          amount: numericAmount,
          method
        });
      }
    }, 2000);
  });
};

// Check payment status function
export const checkPaymentStatus = async (orderTrackingId: string): Promise<string> => {
  console.log(`Checking payment status for order: ${orderTrackingId}`);
  
  // Simulate API call to check payment status
  return new Promise((resolve) => {
    setTimeout(() => {
      // For demonstration, randomly return a status
      const statuses = ["PENDING", "COMPLETED", "FAILED"];
      const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
      resolve(randomStatus);
    }, 1000);
  });
};

// Format amount to 2 decimal places
export const formatAmount = (amount: string | number): number => {
  const numericAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
  return parseFloat(numericAmount.toFixed(2));
};
