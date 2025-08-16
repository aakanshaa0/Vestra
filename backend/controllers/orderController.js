import Order from '../models/orderModel.js';
import productModel from '../models/productModel.js';
import { v4 as uuidv4 } from 'uuid';

//Create new order
export const createOrder = async (req, res) => {
  try {
    console.log('Creating order with data:', req.body);
    console.log('User from auth:', req.user);
    
    const { items, address, amount, shippingAddress, paymentMethod, userId } = req.body;
    
    const orderItems = [];
    let total = 0;
    
    if (items && Array.isArray(items)) {
      for (const item of items) {
        if (item._id && item.price && item.quantity) {
          orderItems.push({
            productId: item._id,
            quantity: item.quantity,
            price: item.price,
            name: item.name || 'Unknown Product',
            size: item.size || 'N/A',
            images: item.images || item.image || []
          });
          total += item.price * item.quantity;
        } 
        else if (item.productId) {
          const product = await productModel.findById(item.productId);
          if (!product) {
            return res.status(404).json({ success: false, message: `Product ${item.productId} not found` });
          }
          
          total += product.price * item.quantity;
          orderItems.push({
            productId: product._id,
            quantity: item.quantity,
            price: product.price,
            name: product.name,
            size: item.size || 'N/A',
            images: product.images || []
          });
        }
      }
    }
    
    //Use amount from frontend if available, otherwise calculate
    if (amount && amount > 0) {
      total = amount;
    }
    
    //Transform address format if needed
    let finalShippingAddress = shippingAddress;
    if (address && !shippingAddress) {
      finalShippingAddress = {
        name: `${address.firstName || ''} ${address.lastName || ''}`.trim(),
        address: address.street || '',
        city: address.city || '',
        state: address.state || '',
        pincode: address.zipcode || '',
        phone: address.phone || ''
      };
    }

    //Create order
    const order = new Order({
      items: orderItems,
      total,
      buyerId: req.user.id,
      sellerId: req.user.id,
      shippingAddress: finalShippingAddress,
      paymentMethod: paymentMethod || 'cod',
      status: paymentMethod === 'stripe' ? 'pending_payment' : 'pending',
      paymentStatus: paymentMethod === 'stripe' ? 'pending' : 'pending',
      transactionId: `TXN${uuidv4().replace(/-/g, '').toUpperCase()}`,
    });

    console.log('Saving order:', order);
    await order.save();
    
    res.status(201).json({ success: true, order });
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

//Get orders for admin
export const getAdminOrders = async (req, res) => {
  try {
    console.log('Admin requesting all orders');
    
    const orders = await Order.find({})
      .populate('buyerId', 'name email')
      .populate('sellerId', 'name email')
      .populate('items.productId', 'name price images')
      .sort('-createdAt');
    
    console.log('Found orders:', orders.length);
    
    //Ensure all orders have required fields
    const processedOrders = orders.map(order => ({
      ...order.toObject(),
      status: order.status || 'pending',
      items: order.items || [],
      total: order.total || 0,
      createdAt: order.createdAt || order.date || new Date()
    }));
    
    res.json({ success: true, orders: processedOrders });
  } catch (error) {
    console.error('Error fetching admin orders:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

//Update order status
export const updateOrderStatus = async (req, res) => {
  try {
    const { orderId, status } = req.body;
    
    const order = await Order.findOneAndUpdate(
      { _id: orderId, sellerId: req.user.id },
      { status },
      { new: true }
    );
    
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }
    
    res.json({ success: true, order });
  } catch (error) {
    console.error('Error updating order status:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const getOrderDetails = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('buyerId', 'name email')
      .populate('items.productId', 'name price');
      
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }
    
    res.json({ success: true, order });
  } catch (error) {
    console.error('Error fetching order details:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

//Get orders for user
export const getUserOrders = async (req, res) => {
  try {
    console.log('User requesting orders for buyer ID:', req.user.id);
    
    const orders = await Order.find({ buyerId: req.user.id })
      .populate('sellerId', 'name email')
      .populate('items.productId', 'name price images')
      .sort('-createdAt');
    
    console.log('Found user orders:', orders.length);
    
    //Ensure all orders have required fields
    const processedOrders = orders.map(order => ({
      ...order.toObject(),
      status: order.status || 'pending',
      items: order.items || [],
      total: order.total || 0,
      createdAt: order.createdAt || order.date || new Date()
    }));
    
    res.json({ success: true, orders: processedOrders });
  } catch (error) {
    console.error('Error fetching user orders:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
