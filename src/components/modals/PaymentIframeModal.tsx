
import React, { useEffect, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { X } from "lucide-react";

interface PaymentIframeModalProps {
  isOpen: boolean;
  onClose: () => void;
  paymentUrl: string;
}

const PaymentIframeModal: React.FC<PaymentIframeModalProps> = ({
  isOpen,
  onClose,
  paymentUrl,
}) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Handle iframe load events
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      // Check if the message is from our payment gateway
      if (event.origin === new URL(paymentUrl).origin) {
        if (event.data === "payment_completed") {
          onClose();
        }
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [paymentUrl, onClose]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[800px] h-[600px] p-0">
        <DialogHeader className="px-6 py-4 flex flex-row items-center justify-between">
          <DialogTitle>Complete Your Payment</DialogTitle>
          <button
            onClick={onClose}
            className="rounded-full p-1 hover:bg-accent"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </DialogHeader>
        <div className="flex-1 h-[calc(600px-64px)]">
          <iframe
            ref={iframeRef}
            src={paymentUrl}
            className="w-full h-full border-0"
            allow="payment"
            title="Payment Gateway"
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PaymentIframeModal;
