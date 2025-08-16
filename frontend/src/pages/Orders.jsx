import React, { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../context/ShopContext';
import Title from '../components/Title';
import axios from 'axios';


const Orders = () => {
  const {backendUrl, token, currency} = useContext(ShopContext);

  const [orderData, setOrderData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadOrderData = async () => {
    try{
      if(!token){
        console.log('Debug: No token available');
        return null
      }
      
      setLoading(true);
      setError(null);
      
      console.log('Debug: Fetching orders with token:', token.substring(0, 20) + '...');
      
      const response = await axios.get(backendUrl + '/api/order/userOrders', {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      console.log('Debug: Orders response:', response.data);
      
              if(response.data.success){
          console.log('Debug: Raw orders data:', response.data.orders);
          
          let allOrderItems = []
          response.data.orders.map((order)=>{
            console.log('Debug: Processing order:', order);
            order.items.map((item)=>{
              console.log('Debug: Processing item:', item);
              console.log('Debug: Item image fields:', {
                images: item.images,
                image: item.image,
                productId: item.productId,
                productImages: item.productId?.images
              });
              console.log('Debug: Item size:', item.size);
              
              if (!item.images && item.image) {
                item.images = [item.image];
              }
              
              item['status'] = order.status
              item['payment'] = order.paymentStatus
              item['paymentMethod'] = order.paymentMethod
              item['date'] = order.createdAt || order.date
              allOrderItems.push(item)
            })
          })
          
          console.log('Debug: Processed order items:', allOrderItems);
          setOrderData(allOrderItems.reverse())
          
        }
    }
    catch(error){
      console.error('Debug: Error loading orders:', error);
      if (error.response) {
        console.error('Debug: Error response:', error.response.data);
        console.error('Debug: Error status:', error.response.status);
        setError(`Error ${error.response.status}: ${error.response.data.message || 'Failed to load orders'}`);
      } else {
        setError('Failed to load orders. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  }

  useEffect(()=>{
    loadOrderData()
  }, [token])

  return (
    <div className='border-t pt-16'>
      <div className='text-2xl'>
        <Title text1 = {'MY'} text2 = {'ORDERS'}/>
      </div>
      
      {loading && (
        <div className='text-center py-8'>
          <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto'></div>
          <p className='mt-2 text-gray-600'>Loading orders</p>
        </div>
      )}
      
      {error && (
        <div className='text-center py-8'>
          <p className='text-red-600 mb-4'>{error}</p>
          <button 
            onClick={loadOrderData}
            className='bg-black text-white px-6 py-2 rounded hover:bg-gray-800 transition-colors'
          >
            Try Again
          </button>
        </div>
      )}
      
      {!loading && !error && orderData.length === 0 && (
        <div className='text-center py-8'>
          <p className='text-gray-600'>No orders found. Start shopping to see your orders here!</p>
        </div>
      )}
      
      {!loading && !error && orderData.length > 0 && (
        <div>
          {orderData.map((item, index)=>(
          <div key={index} className='py-4 border-b text-gray-700 flex flex-col md:flex-row md:items-center md:justify-between gap-4'>
            <div className='flex items-start gap-6 text-sm'>
              <img 
                className='w-16 sm:w-20' 
                src={(() => {
                  const imageUrl = (item.productId && item.productId.images && item.productId.images[0]) ||
                    item.images?.[0] || 
                    item.image?.[0] || 
                    item.image || 
                    '/placeholder-image.jpg';
                  
                  console.log('Debug: Using image URL:', imageUrl, 'for item:', item.name);
                  return imageUrl;
                })()}
                alt={item.name || 'Product'} 
                onError={(e) => {
                  console.log('Debug: Image failed to load for item:', item);
                  console.log('Debug: Available image fields:', {
                    images: item.images,
                    image: item.image,
                    productId: item.productId,
                    productImages: item.productId?.images
                  });
                  e.target.src = '/placeholder-image.jpg';
                  e.target.onerror = null;
                }}
              />
              <div>
              <p className='sm:text-base font-medium'>{item.name || 'Unknown Product'}</p>
              <div className='flex items-center gap-3 mt-1 text-base text-gray-700'>
                <p>{currency}{item.price || 0}</p>
                <p>Quantity: {item.quantity || 0}</p>
                <p>Size: {item.size || 'N/A'}</p>
              </div>
              <p className='mt-1'>Date: <span className='text-gray-400'>{item.date ? new Date(item.date).toDateString() : 'N/A'}</span></p>
              <p className='mt-1'>Payment: <span className='text-gray-400'>{item.paymentMethod || 'N/A'}</span></p>
              </div>
            </div>
            <div className='md:w-1/2 flex justify-between'>
              <div className='flex items-center gap-2'>
                <p className='min-w-2 h-2 rounded-full bg-green-500'></p>
                <p className='text-sm md:text-base'>{item.status || 'Unknown'}</p>
              </div>
              <button onClick={loadOrderData} className='border px-4 py-2 text-sm font-medium rounded-sm'>Track Order</button>
            </div>
          </div>
        ))}
        </div>
      )}
    </div>
  )
}

export default Orders;