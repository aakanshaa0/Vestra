import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  items: [{
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'product', required: true },
    quantity: { type: Number, required: true },
    price: { type: Number, required: true },
    name: { type: String, required: true },
    size: { type: String, default: 'N/A' },
    images: { type: [String], default: [] }
  }],
  total: { type: Number, required: true },
  buyerId: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true },
  sellerId: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true },
  shippingAddress: {
    name: String,
    address: String,
    city: String,
    state: String,
    pincode: String,
    phone: String
  },
  status: { 
    type: String, 
    enum: ['pending', 'pending_payment', 'processing', 'shipped', 'delivered', 'cancelled'],
    default: 'pending' 
  },
  paymentStatus: { 
    type: String, 
    enum: ['pending', 'completed', 'failed', 'refunded'],
    default: 'pending' 
  },
  paymentMethod: String,
  transactionId: String,
  stripePaymentId: String,
  paidAt: Date,
  date: { type: Date, default: Date.now }
}, { 
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

orderSchema.virtual('formattedDate').get(function() {
  return this.createdAt || this.date;
});

orderSchema.pre('save', function(next) {
  if (!this.status) {
    this.status = 'pending';
  }
  next();
});

const Order = mongoose.models.Order || mongoose.model('Order', orderSchema);

export default Order;
