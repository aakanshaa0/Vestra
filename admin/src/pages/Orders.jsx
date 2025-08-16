import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const navigate = useNavigate();

  const handleAuthError = () => {
    localStorage.removeItem('admin_token');
    navigate('/login');
  };

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem('admin_token');
        console.log('Debug: Token from localStorage:', token);
        
        if (!token) {
          setError('No admin token found. Please login again.');
          setLoading(false);
          return;
        }

        if (token.split('.').length !== 3) {
          console.error('Invalid token format:', token);
          setError('Invalid token format. Please login again.');
          setLoading(false);
          return;
        }

        console.log('Token format looks valid');
        console.log('Fetching orders with token:', token.substring(0, 20) + '...');
        
        const response = await fetch('http://localhost:3000/api/order/admin/orders', {
          headers: {
            'token': token,
          },
        });
        
        console.log('Response status:', response.status);
        console.log('Response headers:', response.headers);
        
        if (!response.ok) {
          if (response.status === 401) {
            setError('Authentication failed. Please login again.');
            handleAuthError();
          } else {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          return;
        }
        
        const data = await response.json();
        console.log('Orders response:', data);
        
        if (data.success) {
          setOrders(data.orders || []);
          if (!data.orders || data.orders.length === 0) {
            setError('No orders found');
          }
        } else {
          setError(data.message || 'Failed to load orders');
        }
      } catch (err) {
        console.error('Error fetching orders:', err);
        setError(`Network error: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      const token = localStorage.getItem('admin_token');
      const response = await fetch('http://localhost:3000/api/order/admin/update-status', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'token': token,
        },
        body: JSON.stringify({
          orderId,
          status: newStatus,
        }),
      });
      
      const data = await response.json();
      
      if (data.success) {
        setOrders(orders.map(order => 
          order._id === orderId ? { ...order, status: newStatus } : order
        ));
      } else {
        setError(data.message || 'Failed to update order status');
      }
    } catch (err) {
      console.error('Error updating order status:', err);
      setError('Network error');
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return <div className="p-8">Loading orders...</div>;
  }

  if (error) {
    return (
      <div className="p-8">
        <div className="text-red-600 mb-4">{error}</div>
        <div className="flex gap-4">
          <button 
            onClick={() => window.location.reload()} 
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Retry
          </button>
          <button 
            onClick={handleAuthError} 
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            Logout & Login Again
          </button>
        </div>
      </div>
    );
  }

  if (!orders || orders.length === 0) {
    return (
      <div className="p-8">
        <h2 className="text-2xl font-bold mb-6">Orders</h2>
        <div className="text-center py-8 text-gray-500">
          No orders found. Orders will appear here once customers place them.
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      {/*Header Section*/}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Orders</h1>
        <div className="flex items-center gap-4">
          <div className="bg-white px-4 py-2 rounded-lg shadow-sm border">
            <span className="text-2xl font-bold text-blue-600">{orders.length}</span>
            <span className="text-gray-600 ml-2">Total Orders</span>
          </div>
          <div className="bg-white px-4 py-2 rounded-lg shadow-sm border">
            <span className="text-2xl font-bold text-yellow-600">
              {orders.filter(o => o.status === 'pending').length}
            </span>
            <span className="text-gray-600 ml-2">Pending</span>
          </div>
          <div className="bg-white px-4 py-2 rounded-lg shadow-sm border">
            <span className="text-2xl font-bold text-green-600">
              {orders.filter(o => o.status === 'paid' || o.status === 'delivered').length}
            </span>
            <span className="text-gray-600 ml-2">Completed</span>
          </div>
        </div>
      </div>
      
      {/*Orders Table*/}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
        <div className="px-6 py-4 bg-gray-800 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-white">Order Management</h2>
          <p className="text-sm text-gray-300">Manage and track all customer orders</p>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Order ID
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Date & Time
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Customer Details
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Items
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Total Amount
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {orders.map((order, index) => (
                <tr key={order._id} className={`hover:bg-gray-100 transition-colors duration-200 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center mr-3">
                        <span className="text-xs font-bold text-white">#{index + 1}</span>
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900 font-mono">
                          {order.transactionId || order._id?.substring(0, 8) || 'N/A'}...
                        </div>
                        <div className="text-xs text-gray-500">ID: {order._id?.substring(0, 12)}...</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 font-medium">
                      {formatDate(order.createdAt || order.date || new Date())}
                    </div>
                    <div className="text-xs text-gray-500">
                      {new Date(order.createdAt || order.date || new Date()).toLocaleTimeString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center mr-3">
                        <span className="text-sm font-bold text-white">
                          {(order.buyerId?.name || 'G').charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {order.buyerId?.name || 'Guest User'}
                        </div>
                        <div className="text-sm text-gray-500">
                          {order.buyerId?.email || 'No email'}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center mr-3">
                        <span className="text-sm font-bold text-white">
                          {order.items?.length || 0}
                        </span>
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {order.items?.length || 0} item{(order.items?.length || 0) !== 1 ? 's' : ''}
                        </div>
                        <div className="text-xs text-gray-500">
                          {order.items?.length > 0 ? 'View details' : 'No items'}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-lg font-bold text-green-600">
                      ${(order.total || 0).toFixed(2)}
                    </div>
                    <div className="text-xs text-gray-500">
                      {order.paymentMethod || 'COD'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full shadow-sm
                      ${(order.status || 'pending') === 'paid' ? 'bg-green-100 text-green-800 border border-green-200' : 
                        (order.status || 'pending') === 'delivered' ? 'bg-blue-100 text-blue-800 border border-blue-200' : 
                        (order.status || 'pending') === 'cancelled' ? 'bg-red-100 text-red-800 border border-red-200' : 
                        (order.status || 'pending') === 'shipped' ? 'bg-purple-100 text-purple-800 border border-purple-200' :
                        (order.status || 'pending') === 'processing' ? 'bg-yellow-100 text-yellow-800 border border-yellow-200' :
                        'bg-gray-100 text-gray-800 border border-gray-200'}`}>
                      <div className="w-2 h-2 rounded-full mr-2 
                        ${(order.status || 'pending') === 'paid' ? 'bg-green-400' : 
                          (order.status || 'pending') === 'delivered' ? 'bg-blue-400' : 
                          (order.status || 'pending') === 'cancelled' ? 'bg-red-400' : 
                          (order.status || 'pending') === 'shipped' ? 'bg-purple-400' :
                          (order.status || 'pending') === 'processing' ? 'bg-yellow-400' :
                          'bg-gray-400'}"></div>
                      {order.status || 'pending'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => setSelectedOrder(order)}
                        className="px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-white bg-gray-800 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors duration-200"
                      >
                        View
                      </button>
                      <select
                        value={order.status || 'pending'}
                        onChange={(e) => updateOrderStatus(order._id, e.target.value)}
                        className="text-xs border border-gray-300 rounded-md px-2 py-1.5 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200"
                      >
                        <option value="pending">Pending</option>
                        <option value="processing">Processing</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/*Order Details*/}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="p-8">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">Order Details</h3>
                  <p className="text-gray-600">Complete information about this order</p>
                </div>
                <button 
                  onClick={() => setSelectedOrder(null)}
                  className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-gray-600 hover:bg-gray-200 transition-colors duration-200"
                >
                  ✕
                </button>
              </div>
              
              {/*Order Summary*/}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
                  <div className="text-sm font-medium text-gray-300 mb-1">Order ID</div>
                  <div className="text-lg font-bold text-white font-mono">
                    {selectedOrder.transactionId || selectedOrder._id?.substring(0, 8) || 'N/A'}
                  </div>
                </div>
                <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
                  <div className="text-sm font-medium text-gray-300 mb-1">Total Amount</div>
                  <div className="text-lg font-bold text-white">
                    ${(selectedOrder.total || 0).toFixed(2)}
                  </div>
                </div>
                <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
                  <div className="text-sm font-medium text-gray-300 mb-1">Payment Method</div>
                  <div className="text-lg font-bold text-white">
                    {selectedOrder.paymentMethod || 'COD'}
                  </div>
                </div>
              </div>

              {/*Order Info*/}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">
                    Customer Information
                  </h4>
                  <div className="space-y-3">
                    <div>
                      <div className="text-sm font-medium text-gray-600">Name</div>
                      <div className="text-base text-gray-900">{selectedOrder.buyerId?.name || 'Guest User'}</div>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-600">Email</div>
                      <div className="text-base text-gray-900">{selectedOrder.buyerId?.email || 'No email'}</div>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-600">Order Date</div>
                      <div className="text-base text-gray-900">
                        {formatDate(selectedOrder.createdAt || selectedOrder.date || new Date())}
                      </div>
                    </div>
                  </div>
                </div>

                {/*Shipping Address*/}
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">
                    Shipping Address
                  </h4>
                  {selectedOrder.shippingAddress ? (
                    <div className="space-y-2">
                      <div className="text-base text-gray-900 font-medium">
                        {selectedOrder.shippingAddress.name || 'N/A'}
                      </div>
                      <div className="text-sm text-gray-700">
                        {selectedOrder.shippingAddress.address || 'N/A'}
                      </div>
                      <div className="text-sm text-gray-700">
                        {selectedOrder.shippingAddress.city || 'N/A'}, {selectedOrder.shippingAddress.state || 'N/A'} {selectedOrder.shippingAddress.pincode || 'N/A'}
                      </div>
                      <div className="text-sm text-gray-700">
                        Phone: {selectedOrder.shippingAddress.phone || 'N/A'}
                      </div>
                    </div>
                  ) : (
                    <p className="text-gray-500">No shipping address found.</p>
                  )}
                </div>
              </div>

              {/*Items Section*/}
              <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
                  <h4 className="text-lg font-semibold text-gray-900">
                    Order Items ({selectedOrder.items?.length || 0})
                  </h4>
                </div>
                <div className="p-6">
                  {selectedOrder.items && selectedOrder.items.length > 0 ? (
                    <div className="space-y-4">
                      {selectedOrder.items.map((item, index) => (
                        <div key={index} className="flex items-center p-4 bg-gray-50 rounded-lg border border-gray-200">
                          <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg border border-gray-200 bg-white">
                            <img
                              src={item.images?.[0] || item.image || '/placeholder-image.jpg'}
                              alt={item.name || 'Product'}
                              className="h-full w-full object-cover object-center"
                              onError={(e) => {
                                e.target.src = '/placeholder-image.jpg';
                              }}
                            />
                          </div>
                          <div className="ml-4 flex-1">
                            <div className="flex justify-between items-start">
                              <div>
                                <h3 className="text-lg font-medium text-gray-900">{item.name || 'Unknown Product'}</h3>
                                <p className="text-sm text-gray-600">Size: {item.size || 'N/A'}</p>
                                <p className="text-sm text-gray-600">Quantity: {item.quantity || 0}</p>
                              </div>
                              <div className="text-right">
                                <p className="text-lg font-bold text-green-600">${(item.price || 0).toFixed(2)}</p>
                                <p className="text-sm text-gray-600">Total: ${((item.price || 0) * (item.quantity || 0)).toFixed(2)}</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-gray-500">No items found for this order.</p>
                    </div>
                  )}
                </div>
              </div>

              {/*Actions*/}
              <div className="mt-8 flex justify-end gap-4">
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="px-6 py-3 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    console.log('Order actions for:', selectedOrder._id);
                  }}
                  className="px-6 py-3 bg-gray-800 text-white rounded-lg text-sm font-medium hover:bg-gray-700 transition-colors duration-200"
                >
                  Take Action
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
