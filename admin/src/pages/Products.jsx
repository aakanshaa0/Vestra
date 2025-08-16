import React, { useEffect, useState } from 'react';

export default function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const token = localStorage.getItem('admin_token');
        
        if (!token) {
          setError('No admin token found. Please login again.');
          setLoading(false);
          return;
        }

        console.log('🔍 Fetching products with token:', token.substring(0, 20) + '...');
        
        const response = await fetch('http://localhost:3000/api/product/list', {
          headers: {
            'token': token,
          },
        });

        console.log('📡 Products response status:', response.status);
        
        if (!response.ok) {
          if (response.status === 401) {
            setError('Authentication failed. Please login again.');
            localStorage.removeItem('admin_token');
            window.location.href = '/login';
            return;
          } else {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
        }

        const data = await response.json();
        console.log('📦 Products response:', data);
        
        if (data.success) {
          const myProducts = data.products || [];
          setProducts(myProducts);
        } else {
          setError(data.message || 'Failed to load products');
        }
      } catch (err) {
        console.error('❌ Error fetching products:', err);
        setError(`Network error: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleDelete = async (productId) => {
    if (window.confirm('Delete this product?')) {
      try {
        setLoading(true);
        const token = localStorage.getItem('admin_token');
        
        const response = await fetch('http://localhost:3000/api/product/remove', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'token': token,
          },
          body: JSON.stringify({ id: productId })
        });

        const data = await response.json();
        
        if (data.success) {
          setProducts(products.filter(x => x._id !== productId));
        } else {
          alert(data.message || 'Failed to delete');
        }
      } catch (err) {
        console.error('❌ Error deleting product:', err);
        alert('Network error occurred');
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div style={{ padding: 32 }}>
      <h2>All Products List</h2>
      {loading ? (
        <div>Loading...</div>
      ) : error ? (
        <div style={{ color: 'red' }}>{error}</div>
      ) : (
        <table border="1" cellPadding="8" style={{ width: '100%', marginTop: 16, borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th>Image</th>
              <th>Name</th>
              <th>Category</th>
              <th>Price</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {products.map(p => (
              <tr key={p._id}>
                <td>
                  {p.images && p.images.length > 0 ? (
                    <img src={p.images[0]} alt={p.name} style={{ width: 60, height: 60, objectFit: 'cover', borderRadius: 8 }} />
                  ) : (
                    <span style={{ color: '#888' }}>No Image</span>
                  )}
                </td>
                <td>{p.name}</td>
                <td>{p.category}</td>
                <td>${p.price}</td>
                <td>
                  <button onClick={() => handleDelete(p._id)}>X</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
