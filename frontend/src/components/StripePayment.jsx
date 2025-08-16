import React, { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { toast } from 'react-toastify';
import axios from 'axios';

//Load Stripe
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

const CheckoutForm = ({ amount, orderId, onSuccess, onError }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [clientSecret, setClientSecret] = useState('');

  useEffect(() => {
    if (amount && amount > 0) {
      createPaymentIntent();
    }
  }, [amount]);

  const createPaymentIntent = async () => {
    try {
      setLoading(true);
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/payment/create-payment-intent`,
        {
          amount: amount,
          currency: 'inr',
          metadata: {
            orderId: orderId
          }
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      );

      if (response.data.success) {
        console.log('Debug: Payment intent created successfully');
        console.log('Debug: Client secret received');
        setClientSecret(response.data.clientSecret);
      } else {
        console.error('Debug: Failed to create payment intent:', response.data);
        toast.error(response.data.message || 'Failed to create payment intent');
        onError(new Error(response.data.message || 'Failed to create payment intent'));
      }
    }
    catch (error) {
      console.error('Error creating payment intent:', error);
      toast.error('Failed to initialize payment');
      onError();
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    if (!stripe || !elements || !clientSecret) {
      return;
    }

    setLoading(true);

    try {
      const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
        }
      });

      if (error) {
        toast.error(error.message || 'Payment failed');
        onError(error);
      } 
      else if (paymentIntent.status === 'succeeded') {
        try {
          //Confirm payment with backend
          await confirmPayment(paymentIntent.id);
          toast.success('Payment successful!');
          onSuccess(paymentIntent);
        } catch (confirmError) {
          console.error('Payment confirmation failed:', confirmError);
          toast.error('Payment confirmation failed. Please contact support.');
          onError(confirmError);
        }
      }
    } 
    catch (error) {
      console.error('Payment error:', error);
      if (error.message) {
        toast.error(error.message);
      } else {
        toast.error('Payment failed. Please try again.');
      }
      onError(error);
    } 
    finally {
      setLoading(false);
    }
  };

  const confirmPayment = async (paymentIntentId) => {
    try {
      console.log('Debug: Confirming payment with backend');
      console.log('Debug: Payment Intent ID:', paymentIntentId);
      console.log('Debug: Order ID:', orderId);
      
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/payment/confirm-payment`,
        {
          paymentIntentId: paymentIntentId,
          orderId: orderId
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      );
      
      console.log('Debug: Payment confirmation response:', response.data);
      
      if (!response.data.success) {
        throw new Error(response.data.message || 'Payment confirmation failed');
      }
      
      return response.data;
    } catch (error) {
      console.error('Error confirming payment:', error);
      if (error.response) {
        console.error('Error response:', error.response.data);
        console.error('Error status:', error.response.status);
      }
      throw error;
    }
  };

  const cardElementOptions = {
    style: {
      base: {
        fontSize: '16px',
        color: '#424770',
        '::placeholder': {
          color: '#aab7c4',
        },
      },
      invalid: {
        color: '#9e2146',
      },
    },
  };

  if (!clientSecret) {
    return (
      <div className="text-center py-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
        <p className="mt-2 text-gray-600">Initializing payment...</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="border border-gray-300 rounded-lg p-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Card Details
        </label>
        <CardElement options={cardElementOptions} />
      </div>
      
      <button
        type="submit"
        disabled={!stripe || loading}
        className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
      >
        {loading ? 'Processing...' : `Pay ₹${amount}`}
      </button>
      
      <div className="text-xs text-gray-500 text-center">
        Your payment is secured by Stripe. We never store your card details.
      </div>
    </form>
  );
};

const StripePayment = ({ amount, orderId, onSuccess, onError }) => {
  return (
    <div className="max-w-md mx-auto">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Secure Payment</h3>
        <p className="text-sm text-gray-600">Complete your purchase with Stripe</p>
      </div>
      
      <Elements stripe={stripePromise}>
        <CheckoutForm
          amount={amount}
          orderId={orderId}
          onSuccess={onSuccess}
          onError={onError}
        />
      </Elements>
    </div>
  );
};

export default StripePayment;
