import { useEffect, useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { ArrowLeft, CreditCard, MapPin, CheckCircle2, Clock } from 'lucide-react';

interface PaymentPayload {
  key: string;
  amount: number;
  currency: string;
  orderId: string;
  name: string;
  description: string;
  prefill: {
    name: string;
    email: string;
    contact: string;
  };
}

interface OrderState {
  id?: string;
  restaurantName?: string;
  total?: number;
  status?: string;
  date?: string;
  address?: string;
  paymentMode?: string;
  payment?: PaymentPayload;
}

interface PaymentLocationState {
  paymentData?: OrderState;
  address?: string;
}

const API_URL = 'http://localhost:8001/api';

export default function Payment() {
  const { clearCart } = useApp();
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as PaymentLocationState | null;
  const paymentData = state?.paymentData;
  const [checkoutOpened, setCheckoutOpened] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);

  const loadRazorpayScript = () => {
    return new Promise<boolean>((resolve) => {
      if ((window as any).Razorpay) {
        resolve(true);
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const confirmPayment = async (response: any) => {
    setIsProcessing(true);
    setCheckoutError(null);

    try {
      const res = await fetch(`${API_URL}/orders/payment/confirm`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token') || ''}`,
        },
        body: JSON.stringify({
          razorpay_order_id: response.razorpay_order_id,
          razorpay_payment_id: response.razorpay_payment_id,
          razorpay_signature: response.razorpay_signature,
          orderId: paymentData?.id,
        }),
      });

      const result = await res.json();
      if (!res.ok) {
        throw new Error(result.error || 'Payment confirmation failed');
      }

      clearCart();
      navigate('/orders', { replace: true });
    } catch (error) {
      setCheckoutError(error instanceof Error ? error.message : 'Payment verification failed');
    } finally {
      setIsProcessing(false);
    }
  };

  const openRazorpayCheckout = async () => {
    if (!paymentData?.payment) {
      setCheckoutError('Payment details are unavailable.');
      return;
    }

    const loaded = await loadRazorpayScript();
    if (!loaded) {
      setCheckoutError('Unable to load payment gateway. Please try again.');
      return;
    }

    setCheckoutOpened(true);

    const options = {
      key: paymentData.payment.key,
      amount: paymentData.payment.amount,
      currency: paymentData.payment.currency,
      name: paymentData.payment.name,
      description: paymentData.payment.description,
      order_id: paymentData.payment.orderId?.startsWith('order_') ? paymentData.payment.orderId : undefined,
      prefill: paymentData.payment.prefill,
      notes: {
        orderNumber: paymentData.id,
      },
      theme: {
        color: '#ef4444',
      },
      handler: (response: any) => confirmPayment(response),
      modal: {
        ondismiss: () => setCheckoutError('Payment was cancelled. You can retry below.'),
      },
    };

    const Razorpay = (window as any).Razorpay;
    const rzp = new Razorpay(options);
    rzp.open();
  };

  useEffect(() => {
    if (!paymentData) {
      navigate('/cart', { replace: true });
    }
  }, [navigate, paymentData]);

  useEffect(() => {
    if (paymentData?.payment && !checkoutOpened && !checkoutError) {
      openRazorpayCheckout();
    }
  }, [paymentData, checkoutOpened, checkoutError]);

  if (!paymentData) {
    return null;
  }

  const payment = paymentData.payment;
  const orderId = paymentData.id || payment?.orderId || 'N/A';
  const totalAmount = paymentData.total ?? (payment?.amount ? Math.round(payment.amount / 100) : 0);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Cart
        </button>

        <div className="bg-white rounded-3xl p-6 shadow-sm">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between mb-6">
            <div>
              <p className="text-sm text-gray-500">Order ID</p>
              <h1 className="text-2xl font-bold text-gray-900">{orderId}</h1>
            </div>
            <div className="rounded-3xl bg-red-50 px-4 py-3 flex items-center gap-3">
              <CreditCard className="w-6 h-6 text-red-500" />
              <div>
                <p className="text-sm text-gray-500">Payment Mode</p>
                <p className="font-semibold text-gray-900">{paymentData.paymentMode || 'ONLINE'}</p>
              </div>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-4">
              <div className="rounded-3xl border border-gray-200 p-5 bg-gray-50">
                <div className="flex items-center gap-3 mb-3">
                  <MapPin className="w-5 h-5 text-red-500" />
                  <span className="font-semibold text-gray-900">Delivery Address</span>
                </div>
                <p className="text-gray-700">{paymentData.address || state.address || 'No address provided'}</p>
              </div>

              <div className="rounded-3xl border border-gray-200 p-5 bg-gray-50">
                <div className="flex items-center gap-3 mb-3">
                  <Clock className="w-5 h-5 text-gray-500" />
                  <span className="font-semibold text-gray-900">Order Date</span>
                </div>
                <p className="text-gray-700">{paymentData.date || 'Today'}</p>
                <p className="text-sm text-gray-500 mt-1">Your order will be confirmed once the payment is completed.</p>
              </div>
            </div>

            <div className="rounded-3xl border border-gray-200 p-5 bg-white">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-sm text-gray-500">Restaurant</p>
                  <p className="font-semibold text-gray-900">{paymentData.restaurantName || 'Selected Restaurant'}</p>
                </div>
                <div className="flex items-center gap-1 text-gray-900 font-semibold text-lg">
                  <span>₹</span>
                  <span>{totalAmount}</span>
                </div>
              </div>

              <div className="rounded-3xl bg-red-50 p-4 mb-4">
                <p className="text-sm text-red-700 font-medium">Payment Request</p>
                <p className="text-sm text-gray-600 mt-2">
                  {payment
                    ? 'Use the payment gateway details below to complete your order.'
                    : 'Your order is ready to be processed. If you do not see payment details, use cash on delivery or retry the order.'}
                </p>
              </div>

              {payment ? (
                <div className="space-y-3">
                  <div className="rounded-2xl bg-gray-50 p-4 border border-gray-200">
                    <p className="text-xs uppercase tracking-wide text-gray-500 mb-2">Gateway</p>
                    <p className="text-sm text-gray-900">{payment.name}</p>
                  </div>
                  <div className="rounded-2xl bg-gray-50 p-4 border border-gray-200">
                    <p className="text-xs uppercase tracking-wide text-gray-500 mb-2">Order reference</p>
                    <p className="text-sm text-gray-900">{payment.orderId}</p>
                  </div>
                  <div className="rounded-2xl bg-gray-50 p-4 border border-gray-200">
                    <p className="text-xs uppercase tracking-wide text-gray-500 mb-2">Amount</p>
                    <p className="text-sm text-gray-900">{payment.currency} {Math.round(payment.amount / 100)}</p>
                  </div>
                </div>
              ) : (
                <div className="rounded-2xl bg-yellow-50 p-4 border border-yellow-200 text-yellow-800">
                  Payment details are not available. You may return to the cart and try again.
                </div>
              )}

              {checkoutError && (
                <div className="rounded-2xl bg-red-50 p-4 border border-red-200 text-red-800">
                  <p className="font-semibold">{checkoutError}</p>
                  <p className="text-sm text-red-700 mt-1">Click Retry to open the payment gateway again.</p>
                </div>
              )}

              <div className="mt-6 flex flex-col gap-3">
                <button
                  type="button"
                  onClick={() => openRazorpayCheckout()}
                  disabled={isProcessing}
                  className="w-full rounded-2xl bg-red-500 px-5 py-3 text-white font-semibold hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isProcessing ? 'Processing...' : 'Retry Payment'}
                </button>
                <button
                  type="button"
                  onClick={() => navigate('/orders')}
                  className="w-full rounded-2xl bg-white border border-gray-200 px-5 py-3 text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors"
                >
                  View My Orders
                </button>
                <Link
                  to="/cart"
                  className="w-full inline-flex justify-center rounded-2xl border border-gray-200 px-5 py-3 text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors"
                >
                  Back to Cart
                </Link>
              </div>
            </div>
          </div>

          <div className="mt-6 rounded-3xl border border-gray-200 bg-gray-50 p-5">
            <div className="flex items-center gap-3 text-sm text-gray-500">
              <CheckCircle2 className="w-5 h-5 text-green-500" />
              <span>Your order has been created successfully. Complete your payment to continue tracking the order in the Orders section.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
