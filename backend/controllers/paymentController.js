import Stripe from 'stripe';
import Order from '../models/orderModel.js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

//Create payment intent for Stripe
export const createPaymentIntent = async (req, res) => {
  try {
    const { amount, currency = 'inr', metadata = {} } = req.body;
    
    if (!amount || amount <= 0) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid amount' 
      });
    }

    //Create payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100),  //Convert from cents
      currency: currency,
      metadata: metadata,
      automatic_payment_methods: {
        enabled: true,
      },
    });

    res.json({
      success: true,
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id
    });
  } catch (error) {
    console.error('Error creating payment intent:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create payment intent',
      error: error.message
    });
  }
};

//Confirm payment and update order
export const confirmPayment = async (req, res) => {
  try {
    const { paymentIntentId, orderId } = req.body;
    
    if (!paymentIntentId || !orderId) {
      return res.status(400).json({
        success: false,
        message: 'Payment intent ID and order ID are required'
      });
    }

    //Retrieve payment intent from Stripe
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
    
    if (paymentIntent.status === 'succeeded') {
      //Update order status
      const order = await Order.findByIdAndUpdate(
        orderId,
        {
          status: 'paid',
          paymentStatus: 'completed',
          stripePaymentId: paymentIntentId,
          paidAt: new Date()
        },
        { new: true }
      );

      if (!order) {
        return res.status(404).json({
          success: false,
          message: 'Order not found'
        });
      }

      res.json({
        success: true,
        message: 'Payment confirmed successfully',
        order
      });
    } else {
      res.status(400).json({
        success: false,
        message: 'Payment not completed',
        status: paymentIntent.status
      });
    }
  } catch (error) {
    console.error('Error confirming payment:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to confirm payment',
      error: error.message
    });
  }
};

//Get payment status
export const getPaymentStatus = async (req, res) => {
  try {
    const { paymentIntentId } = req.params;
    
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
    
    res.json({
      success: true,
      status: paymentIntent.status,
      amount: paymentIntent.amount / 100, //Convert from cents
      currency: paymentIntent.currency
    });
  } catch (error) {
    console.error('Error getting payment status:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get payment status',
      error: error.message
    });
  }
};

//Refund payment
export const refundPayment = async (req, res) => {
  try {
    const { paymentIntentId, amount, reason = 'requested_by_customer' } = req.body;
    
    if (!paymentIntentId) {
      return res.status(400).json({
        success: false,
        message: 'Payment intent ID is required'
      });
    }

    const refund = await stripe.refunds.create({
      payment_intent: paymentIntentId,
      amount: amount ? Math.round(amount * 100) : undefined,
      reason: reason
    });

    res.json({
      success: true,
      refund,
      message: 'Refund processed successfully'
    });
  } catch (error) {
    console.error('Error processing refund:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to process refund',
      error: error.message
    });
  }
};
