import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { CreditCard, Lock, CheckCircle } from 'lucide-react';
import { useTheme } from '../../components/ThemeProvider';
import api from '../../utils/api';
import { PaymentSkeleton } from '../../components/common/Skeleton';

const PaymentGateway = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { getThemeStyles } = useTheme();
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1200);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return <PaymentSkeleton />;
  }

  const handlePayment = async () => {
    setProcessing(true);
    try {
      await api.enrollInCourse(courseId);
      setProcessing(false);
      alert('Payment successful! Course enrolled.');
      navigate('/my-learning');
    } catch (error) {
      setProcessing(false);
      alert('Enrollment failed. Please try again.');
    }
  };

  return (
    <div className="min-h-screen py-8 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 rounded-lg shadow-lg border bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">
              Complete Your Purchase
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              Secure payment powered by Stripe
            </p>
          </div>

          <div className="mb-6 p-4 rounded-lg border bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600">
            <h3 className="font-semibold mb-2 text-gray-900 dark:text-white">
              Course: Full Stack JavaScript Development
            </h3>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-300">Price:</span>
              <span className="font-bold text-green-600">$299.00</span>
            </div>
          </div>

          <div className="space-y-4 mb-6">
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                Card Number
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="1234 5678 9012 3456"
                  className="w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                />
                <CreditCard className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                  Expiry Date
                </label>
                <input
                  type="text"
                  placeholder="MM/YY"
                  className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                  CVV
                </label>
                <input
                  type="text"
                  placeholder="123"
                  className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                Cardholder Name
              </label>
              <input
                type="text"
                placeholder="John Doe"
                className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
              />
            </div>
          </div>

          <div className="flex items-center justify-center mb-6">
            <Lock className="w-4 h-4 text-green-600 mr-2" />
            <span className="text-sm text-green-600">Secured by 256-bit SSL encryption</span>
          </div>

          <button
            onClick={handlePayment}
            disabled={processing}
            className="w-full flex items-center justify-center py-4 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 font-semibold text-lg"
          >
            {processing ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Processing...
              </>
            ) : (
              <>
                <CheckCircle className="w-5 h-5 mr-2" />
                Complete Payment - $299.00
              </>
            )}
          </button>

          <p className="text-xs text-center mt-4 text-gray-600 dark:text-gray-300">
            By completing this purchase, you agree to our Terms of Service and Privacy Policy
          </p>
        </div>
      </div>
    </div>
  );
};

export default PaymentGateway;