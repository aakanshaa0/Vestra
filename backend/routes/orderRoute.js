import express from 'express';
import { createOrder, getAdminOrders, updateOrderStatus, getOrderDetails, getUserOrders } from '../controllers/orderController.js';
import adminAuth from '../middleware/adminAuth.js';
import auth from '../middleware/auth.js';

const router = express.Router();

//Protected routes
router.post('/', auth, createOrder);
router.post('/place', auth, createOrder);

//User routes
router.get('/userOrders', auth, getUserOrders);

//Admin routes
router.get('/admin/orders', adminAuth, getAdminOrders);
router.put('/admin/update-status', adminAuth, updateOrderStatus);
router.get('/:id', auth, getOrderDetails);

export default router;
