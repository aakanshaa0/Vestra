import express from 'express';
import { createPaymentIntent, confirmPayment, getPaymentStatus, refundPayment } from '../controllers/paymentController.js';
import auth from '../middleware/auth.js';

const router = express.Router();

router.post('/create-payment-intent', auth, createPaymentIntent);

router.post('/confirm-payment', auth, confirmPayment);

router.get('/status/:paymentIntentId', auth, getPaymentStatus);

router.post('/refund', auth, refundPayment);

export default router;
