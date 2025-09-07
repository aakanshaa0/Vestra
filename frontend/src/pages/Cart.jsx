import React from 'react';
import { useEffect, useContext, useState } from 'react';
import { ShopContext } from '../context/ShopContext';
import Title from '../components/Title';
import { RiDeleteBin5Line } from "react-icons/ri";
import CartTotal from "../components/CartTotal";

const Cart = () => {
  const { products, currency, cartItems, updateQuantity, navigate, clearCart } = useContext(ShopContext);
  const [cartData, setCartData] = useState([]);

  useEffect(() => {
    const tempData = [];
    for (const items in cartItems) {
      for (const item in cartItems[items]) {
        if (cartItems[items][item] >= 0) {
          tempData.push({
            _id: items,
            size: item,
            quantity: cartItems[items][item]
          });
        }
      }
    }
    setCartData(tempData);
  }, [cartItems]);

  const handleClearCart = () => {
    if (window.confirm('Are you sure you want to clear your entire cart? This action cannot be undone.')) {
      clearCart();
    }
  };

  return (
    <div className='border-t pt-14'>
      <div className='text-2xl mb-3 flex justify-between items-center'>
        <Title text1={'YOUR'} text2={'CART'} />
        {cartData.length > 0 && (
          <button 
            onClick={handleClearCart}
            className='bg-red-500 hover:bg-red-600 text-white text-sm px-4 py-2 rounded transition-colors'
          >
            Clear Cart
          </button>
        )}
      </div>
      <div>
        {cartData.length === 0 ? (
          <div className='text-center py-16'>
            <p className='text-gray-500 text-lg mb-4'>Your cart is empty</p>
            <p className='text-gray-400 text-sm mb-6'>
              Don't worry, your cart items will be saved even after you log out!
            </p>
            <button 
              onClick={() => navigate('/collection')}
              className='bg-black text-white px-6 py-2 hover:bg-gray-800 transition-colors'
            >
              Continue Shopping
            </button>
          </div>
        ) : (
          cartData.map((item, index) => {
            const productData = products.find((product) => product._id === item._id);
            return (
              <div key={index} className='py-4 border-t border-b text-gray-700 grid grid-cols-[4fr_0.5fr_0.5fr] sm:grid-cols-[4fr_2fr_0.5fr] items-center gap-4'>
                <div className='flex items-start gap-6'>
                  <img className='w-16 sm:w-20' src={productData.image[0]} alt="" />
                  <div>
                    <p className='text-xs sm:text-lg font-medium'>{productData.name}</p>
                    <div className='flex items-center gap-5 mt-2'>
                      <p>{currency}{productData.price}</p>
                      <p className='px-2 sm:px-3 sm:py-1 border bg-slate-50'>{item.size}</p>
                    </div>
                  </div>
                </div>
                <input onChange={(e)=>e.target.value==='' || e.target.value === '0'? null:updateQuantity(item._id,item.size,Number(e.target.value))} className='border max-w-10 sm:max-w-20 px-1 sm:px-2 py-1' type="number" min={1} defaultValue={item.quantity}></input>
                <RiDeleteBin5Line onClick={()=>updateQuantity(item._id, item.size, 0)} className='h-6 w-4 mr-4 sm:h-7 sm:w-5 cursor-pointer'/>
              </div>
            )
          })
        )}
      </div>
      {cartData.length > 0 && (
        <div className='flex justify-end my-20'>
          <div className='w-full sm"w-[450px]'>
             <CartTotal />
             <div className='w-full text-end'>
              <button onClick={(()=>navigate('/place-order'))} className='bg-black text-white text-sm my-8 px-8 py-3'>PROCEED TO CHECKOUT</button>
             </div> 
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;