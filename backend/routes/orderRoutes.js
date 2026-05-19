import express from 'express';
import {
  addOrderItems,
  getMyOrders,
  getOrders,
  updateOrderStatus
} from '../controllers/orderController.js';
import { admin, protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/').post(protect, addOrderItems).get(protect, admin, getOrders);
router.get('/my', protect, getMyOrders);
router.put('/:id', protect, admin, updateOrderStatus);

export default router;
