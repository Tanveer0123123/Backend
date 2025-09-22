
import express from 'express';
import { addToCart, getCart, removeFromCart, updateCartQuantity } from '../controller/cart.controller.js';
import authMiddleware from '../middlewares/auth.middleware.js';

const router = express.Router();

router.post('/add', authMiddleware, addToCart);

router.get('/:userId', authMiddleware, getCart);

router.post('/remove', authMiddleware, removeFromCart);

router.post('/update', authMiddleware, updateCartQuantity);

export default router;
