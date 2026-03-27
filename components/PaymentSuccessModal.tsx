import { CheckCircle } from 'lucide-react';

interface PaymentSuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function PaymentSuccessModal({
  isOpen,
  onClose,
}: PaymentSuccessModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-fade-in">
        <div className="p-6 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Payment Successful!
          </h2>

          <p className="text-gray-600 mb-6">
            Your payment has been verified successfully. Your account has been
            upgraded to STUDENT status.
          </p>

          <button
            onClick={onClose}
            className="w-full py-3 px-4 bg-brand-600 hover:bg-brand-700 text-white font-semibold rounded-xl transition-colors duration-200"
          >
            Continue to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}
