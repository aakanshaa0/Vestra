import express from 'express';
import { addToCart, updateCart, getCart, clearCart, syncCart } from '../controllers/cartController.js';
import auth from '../middleware/auth.js';

const cartRouter = express.Router();

// All cart routes require authentication
cartRouter.post('/add', auth, addToCart);
cartRouter.post('/update', auth, updateCart);
cartRouter.get('/get', auth, getCart);
cartRouter.post('/clear', auth, clearCart);
cartRouter.post('/sync', auth, syncCart);

export default cartRouter;
