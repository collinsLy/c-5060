import { useState } from 'react';
import { processPayment, checkPaymentStatus } from '../utils/payments';
import { Button } from './ui/button';
import { Card } from './ui/card';

export function PaymentTest() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [status, setStatus] = useState<string>('');
  const [error, setError] = useState<string>('');

  const handleTestPayment = async () => {
    setLoading(true);
    setError('');
    setResult(null);
    
    try {
      // Test payment with sample data
      const paymentResult = await processPayment(100, 'card', {
        email: 'test@example.com',
        phoneNumber: '+254712345678'
      });

      setResult(paymentResult);

      if (paymentResult.orderTrackingId) {
        // Check payment status after 5 seconds
        setTimeout(async () => {
          try {
            const paymentStatus = await checkPaymentStatus(paymentResult.orderTrackingId!);
            setStatus(paymentStatus);
          } catch (statusError) {
            setError('Failed to check payment status: ' + (statusError instanceof Error ? statusError.message : 'Unknown error'));
          }
        }, 5000);
      }
    } catch (error) {
      console.error('Test payment failed:', error);
      setError(error instanceof Error ? error.message : 'Payment test failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="p-6 max-w-lg mx-auto my-8">
      <h2 className="text-2xl font-bold mb-4">Payment Integration Test</h2>
      <Button
        onClick={handleTestPayment}
        disabled={loading}
        className="w-full mb-4"
      >
        {loading ? 'Processing...' : 'Test Payment Integration'}
      </Button>

      {error && (
        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded">
          <p className="text-red-600">{error}</p>
        </div>
      )}

      {result && (
        <div className="mt-4 space-y-2">
          <h3 className="font-semibold">Payment Result:</h3>
          <pre className="bg-gray-100 p-4 rounded overflow-auto">
            {JSON.stringify(result, null, 2)}
          </pre>
        </div>
      )}

      {status && (
        <div className="mt-4">
          <h3 className="font-semibold">Payment Status:</h3>
          <p className={`mt-2 font-medium ${status === 'COMPLETED' ? 'text-green-600' : status === 'FAILED' ? 'text-red-600' : 'text-yellow-600'}`}>
            {status}
          </p>
        </div>
      )}
    </Card>
  );
}