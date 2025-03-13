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

// Process payment function
export const processPayment = async (amount: number, method: string, details: any) => {
  // This is a placeholder for actual payment processing
  console.log(`Processing ${amount} payment via ${method}`, details);
  
  // Simulate API call
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        transactionId: `TX-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
        amount,
        method,
      });
    }, 2000);
  });
};
