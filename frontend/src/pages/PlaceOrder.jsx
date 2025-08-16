import React, { useContext, useState, useEffect } from 'react';
import Title from '../components/Title';
import CartTotal from '../components/CartTotal';
import { assets } from '../assets/frontend_assets/assets';
import { ShopContext } from '../context/ShopContext';
import { toast } from 'react-toastify';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FaStripe } from "react-icons/fa6";
import StripePayment from '../components/StripePayment';

const PlaceOrder = () => {
  const navigate = useNavigate();
  const { backendUrl, token: contextToken, cartItems, setCartItems, getCartAmount, delivery_fee, products } = useContext(ShopContext);
  const [token, setToken] = useState(contextToken || localStorage.getItem('token'));
  const [method, setMethod] = useState('cod');
  const [showStripePayment, setShowStripePayment] = useState(false);
  const [currentOrder, setCurrentOrder] = useState(null);

  useEffect(() => {
    if (contextToken) {
      setToken(contextToken);
    }
  }, [contextToken]);

  useEffect(() => {
    if (!token && !localStorage.getItem('token')) {
      toast.error('Please login to place an order');
      navigate('/login');
    }
  }, [token, navigate]);

  if (!token && !localStorage.getItem('token')) {
    return (
      <div className='flex flex-col items-center justify-center min-h-[80vh] pt-14'>
        <div className='text-center'>
          <h2 className='text-2xl font-semibold mb-4'>Authentication Required</h2>
          <p className='text-gray-600 mb-6'>Please login to place an order</p>
          <button 
            onClick={() => navigate('/login')}
            className='bg-black text-white px-8 py-3 rounded hover:bg-gray-800 transition-colors'
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    street: '',
    city: '',
    state: '',
    zipcode: '',
    country: '',
    phone: ''
  });

  const onChangeHandler = (event) => {
    const { name, value } = event.target;
    setFormData((data) => ({ ...data, [name]: value }));
  };

  const handlePaymentSuccess = (paymentIntent) => {
    setCartItems({});
    setShowStripePayment(false);
    setCurrentOrder(null);
    toast.success('Payment successful! Order placed successfully.');
    navigate('/orders');
  };

  const handlePaymentError = (error) => {
    setShowStripePayment(false);
    setCurrentOrder(null);
    if (error && error.message) {
      toast.error(error.message);
    } 
    else {
      toast.error('Payment failed. Please try again.');
    }
  };

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    
    if (!token) {
      toast.error('Please login to place an order');
      navigate('/login');
      return;
    }
    
    if (!method) {
      toast.error('Please select a payment method');
      return;
    }
    
    console.log('Debug: Payment method selected:', method);
    console.log('Debug: Token from context:', token);
    console.log('Debug: Token from localStorage:', localStorage.getItem('token'));
    console.log('Debug: Token length:', token ? token.length : 'no token');
    console.log('Debug: Token starts with:', token ? token.substring(0, 20) + '...' : 'no token');
    
    try {
      let orderItems = [];

      Object.keys(cartItems).forEach((itemId) => {
        Object.keys(cartItems[itemId]).forEach((size) => {
          if (cartItems[itemId][size] > 0) {
            const itemInfo = structuredClone(products.find(product => product._id === itemId));
            if (itemInfo) {
              itemInfo.size = size;
              itemInfo.quantity = cartItems[itemId][size];
              orderItems.push(itemInfo);
            }
          }
        });
      });
      console.log(formData);
      
      let orderData = {
        address: formData,
        items: orderItems,
        amount: getCartAmount() + delivery_fee,
        paymentMethod: method
      };
      
      console.log('Debug: Order data being sent:', orderData);
      console.log('Debug: Backend URL:', backendUrl);

      switch (method) {
        case 'cod':
          console.log('Debug: Sending COD order request');
          const response = await axios.post(`${backendUrl}/api/order/place`, orderData, { headers: { Authorization: `Bearer ${token}` } });
          console.log('Debug: COD order response:', response.data);
          if (response.data.success) {
            setCartItems({});
            toast.success('Order placed successfully!');
            navigate('/orders');
          } 
          else {
            toast.error(response.data.message);
          }
          break;
        case 'stripe':
          console.log('Debug: Sending Stripe order request...');
          const stripeResponse = await axios.post(`${backendUrl}/api/order/place`, orderData, { headers: { Authorization: `Bearer ${token}` } });
          console.log('Debug: Stripe order response:', stripeResponse.data);
          if (stripeResponse.data.success) {
            setCurrentOrder(stripeResponse.data.order);
            setShowStripePayment(true);
          } else {
            toast.error(stripeResponse.data.message);
          }
          break;
        default:
          toast.error('Please select a valid payment method');
          break;
      }
    } 
    catch (error) {
      console.error(error);
      toast.error(error.message);
    }
  };

  if (showStripePayment && currentOrder) {
    return (
      <div className='flex flex-col items-center justify-center min-h-[80vh] pt-14'>
        <div className='w-full max-w-2xl'>
          <div className='text-center mb-8'>
            <Title text1={'STRIPE'} text2={'PAYMENT'} />
            <p className='text-gray-600 mt-2'>Complete your payment to place your order</p>
          </div>
          <StripePayment
            amount={currentOrder.total}
            orderId={currentOrder._id}
            onSuccess={handlePaymentSuccess}
            onError={handlePaymentError}
          />
          <div className='text-center mt-4'>
            <button
              onClick={() => {
                setShowStripePayment(false);
                setCurrentOrder(null);
              }}
              className='text-gray-600 hover:text-gray-800 underline'
            >
              ← Back to order form
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmitHandler} className='flex flex-col sm:flex-row justify-between gap-4 pt-5 sm:pt-14 min-h-[80vh] border-t'>
      <div className='flex flex-col gap-4 w-full sm:max-w-[480px]'>
        <div className='text-xl sm:text-2xl my-3'>
          <Title text1={'DELIVERY'} text2={'INFORMATION'} />
        </div>
        <div className='flex gap-3'>
          <input required onChange={onChangeHandler} name='firstName' value={formData.firstName} className='border border-gray-300 rounded py-1.5 px-3.5 w-full' type="text" placeholder='First name' />
          <input required onChange={onChangeHandler} name='lastName' value={formData.lastName} className='border border-gray-300 rounded py-1.5 px-3.5 w-full' type="text" placeholder='Last name' />
        </div>
        <input required onChange={onChangeHandler} name='email' value={formData.email} className='border border-gray-300 rounded py-1.5 px-3.5 w-full' type="email" placeholder='Email address' />
        <input required onChange={onChangeHandler} name='street' value={formData.street} className='border border-gray-300 rounded py-1.5 px-3.5 w-full' type="text" placeholder='Street' />
        <div className='flex gap-3'>
          <input required onChange={onChangeHandler} name='city' value={formData.city} className='border border-gray-300 rounded py-1.5 px-3.5 w-full' type="text" placeholder='City' />
          <input required onChange={onChangeHandler} name='state' value={formData.state} className='border border-gray-300 rounded py-1.5 px-3.5 w-full' type="text" placeholder='State' />
        </div>
        <div className='flex gap-3'>
          <input required onChange={onChangeHandler} name='zipcode' value={formData.zipcode} className='border border-gray-300 rounded py-1.5 px-3.5 w-full' type="number" placeholder='Zipcode' />
          <input required onChange={onChangeHandler} name='country' value={formData.country} className='border border-gray-300 rounded py-1.5 px-3.5 w-full' type="text" placeholder='Country' />
        </div>
        <input required onChange={onChangeHandler} name='phone' value={formData.phone} className='border border-gray-300 rounded py-1.5 px-3.5 w-full' type="number" placeholder='Phone' />
      </div>
      <div className='mt-8'>
        <div className='mt-8 min-w-80'>
          <CartTotal />
        </div>
        <div className='mt-12'>
          <Title text1={'PAYMENT'} text2={'METHOD'} />
          <div className='flex gap-3 flex-col lg:flex-row'>
            <div 
              onClick={() => setMethod('stripe')} 
              className={`flex items-center gap-3 border p-2 px-3 cursor-pointer transition-all ${
                method === 'stripe' 
                  ? 'border-blue-500 bg-blue-50' 
                  : 'border-gray-300 hover:border-gray-400'
              }`}
            >
              <p className={`min-w-3.5 h-3.5 border rounded-full ${method === 'stripe' ? 'bg-green-400' : 'bg-gray-200'}`}></p>
              <img className={`h-5 mx-4`} src={assets.stripe_logo} alt="Stripe" />
            </div>

            <div 
              onClick={() => setMethod('cod')} 
              className={`flex items-center gap-3 border p-2 px-3 cursor-pointer transition-all ${
                method === 'cod' 
                  ? 'border-blue-500 bg-blue-50' 
                  : 'border-gray-300 hover:border-gray-400'
              }`}
            >
              <p className={`min-w-3.5 h-3.5 border rounded-full ${method === 'cod' ? 'bg-green-400' : 'bg-gray-200'}`}></p>
              <p className='text-gray-500 text-sm font-medium mx-4'>CASH ON DELIVERY</p>
            </div>
          </div>
          
          {!method && (
            <div className='mt-4 text-center'>
              <p className='text-sm text-gray-500'>Please select a payment method to continue</p>
            </div>
          )}
          <div className='w-full text-end mt-8'>
            <button 
              type='submit' 
              disabled={!method}
              className={`px-16 py-3 text-sm transition-colors ${
                method 
                  ? 'bg-black text-white hover:bg-gray-800 cursor-pointer' 
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              PLACE ORDER
            </button>
          </div>
        </div>
      </div>
    </form>
  );
  };
 
export default PlaceOrder;