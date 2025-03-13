import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';
import { checkPaymentStatus } from '@/utils/payments';
import { supabase } from '@/integrations/supabase/client';

const IpnHandler = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const handlePaymentCallback = async () => {
      const orderTrackingId = searchParams.get('OrderTrackingId') || searchParams.get('IPN_ID');
      const orderMerchantReference = searchParams.get('OrderMerchantReference');
      const orderNotificationType = searchParams.get('OrderNotificationType') || 'IPN';
      
      if (!orderTrackingId) {
        console.error('Missing payment tracking ID:', searchParams.toString());
        toast({
          title: 'Payment Error',
          description: 'Invalid payment callback parameters received.',
          variant: 'destructive',
        });
        navigate('/dashboard');
        return;
      }
      
      if (!orderMerchantReference) {
        console.error('Missing required payment parameters:', {
          orderTrackingId,
          orderMerchantReference,
          orderNotificationType
        });
        toast({
          title: 'Payment Error',
          description: 'Invalid payment callback received.',
          variant: 'destructive',
        });
        navigate('/dashboard');
        return;
      }

      let retryCount = 0;
      const maxRetries = 5; // Increased retries for better reliability
      const retryDelay = 3000; // Fixed 3-second delay between retries

      while (retryCount < maxRetries) {
        try {
          // Check payment status from Pesapal
          const status = await checkPaymentStatus(orderTrackingId);

          // Update transaction in database with more details
          const { error: updateError } = await supabase
            .from('transactions')
            .update({
              status: status,
              pesapal_tracking_id: orderTrackingId,
              updated_at: new Date().toISOString(),
              notification_type: orderNotificationType || 'UNKNOWN',
              payment_method: 'pesapal',
              last_check_time: new Date().toISOString(),
              error: null
            })
            .eq('reference', orderMerchantReference);

          if (updateError) {
            console.error('Error updating transaction:', updateError);
            throw new Error(`Failed to update transaction status: ${updateError.message}`);
          }

          // Log successful transaction update
          console.log('Transaction updated successfully:', {
            reference: orderMerchantReference,
            status,
            trackingId: orderTrackingId,
            notificationType: orderNotificationType
          });
          
          // Enhanced status handling with polling requirements
          switch (status) {
            case 'COMPLETED':
            case 'FAILED':
            case 'CANCELLED':
              // Final states - no further action needed
              toast({
                title: status === 'COMPLETED' ? 'Payment Successful' : 'Payment Failed',
                description: status === 'COMPLETED' 
                  ? 'Funds have been added to your trading account.' 
                  : 'Transaction could not be completed.',
                variant: status === 'COMPLETED' ? 'default' : 'destructive',
              });
              break;
            case 'PENDING':
              // Implement background polling logic
              toast({
                title: 'Payment Processing',
                description: 'We\'ll notify you when payment confirmation is complete.',
              });
              break;
            default:
              console.warn('Unexpected payment status:', status);
              toast({
                title: 'Payment Status Unknown',
                description: 'Please check your transaction history for updates.',
                variant: 'destructive',
              });
          }
          
          // If we reach here, break the retry loop
          break;

        } catch (error) {
          console.error(`Error processing payment callback (attempt ${retryCount + 1}/${maxRetries}):`, {
            error: error instanceof Error ? error.message : 'Unknown error',
            stack: error instanceof Error ? error.stack : undefined,
            transactionData: {
              orderMerchantReference,
              orderTrackingId,
              orderNotificationType
            }
          });
          retryCount++;

          if (retryCount === maxRetries) {
            toast({
              title: 'Payment Error',
              description: 'An error occurred while processing your payment. Please contact support if the issue persists.',
              variant: 'destructive',
            });
          } else {
            // Wait before retrying (fixed delay)
            await new Promise(resolve => setTimeout(resolve, retryDelay));
          }
        }
      }

      // Always redirect back to dashboard after processing
      navigate('/dashboard');
    };

    handlePaymentCallback();
  }, [navigate, searchParams]);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center space-y-4">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
        <p className="text-muted-foreground">Processing your payment...</p>
      </div>
    </div>
  );
};

export default IpnHandler;