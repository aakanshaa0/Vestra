import {createContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { products as staticProducts } from '../assets/frontend_assets/assets';

export const ShopContext = createContext();

const ShopContextProvider = (props) => {
    const currency = '$';
    const delivery_fee = 10;
    const [search, setSearch] = useState('');
    const [showSearch, setShowSearch] = useState(false);
    const [cartItems, setCartItems] = useState({});
    const [products, setProducts] = useState(staticProducts); 
    const [token, setToken] = useState(localStorage.getItem('token') || null);
    const navigate = useNavigate();

    useEffect(() => {
        const savedCart = localStorage.getItem('cartItems');
        if(savedCart){
            try {
                setCartItems(JSON.parse(savedCart));
            }
            catch(error) {
                console.error('Error loading cart from localStorage:', error);
                setCartItems({});
            }
        }
    }, []);

    useEffect(() => {
        localStorage.setItem('cartItems', JSON.stringify(cartItems));
    }, [cartItems]);

    //Update token in localStorage when it changes
    useEffect(() => {
        if (token) {
            localStorage.setItem('token', token);
        } 
        else {
            localStorage.removeItem('token');
        }
    }, [token]);

    const addToCart = async(itemId, size)=>{
        let cartData = structuredClone(cartItems);

        if (!cartData[itemId]) {
        cartData[itemId] = {};
        }
        
        if(cartData[itemId][size]){
            cartData[itemId][size]+=1;
        }
        else{
            cartData[itemId][size]=1;
        }
        setCartItems(cartData);
    }

    const getCartCount = () => {
        let totalCount = 0;
        for(const items in cartItems){
            for(const item in cartItems[items]){
                try{
                    if(cartItems[items][item]>0){
                        totalCount+=cartItems[items][item];
                    }
                } 
                catch(err){
                    console.error(err);
                }
            }
        }
        return totalCount;
    }

    const updateQuantity = async (itemId, size, quantity) => {
        let cartData = structuredClone(cartItems);

        if (quantity > 0) {
            cartData[itemId][size] = quantity;
        } 
        else {
            delete cartData[itemId][size];
            if (Object.keys(cartData[itemId]).length === 0) {
                delete cartData[itemId];
            }
        }
        setCartItems(cartData);
    }

    const clearCart = () => {
        setCartItems({});
        localStorage.removeItem('cartItems');
    }

    const getCartAmount = () =>{
        let totalAmount=0;
        for(const items in cartItems){
            let itemInfo = products.find((product)=>product._id===items);
            for(const item in cartItems[items]){
                try{
                    if(cartItems[items][item]>0){
                        totalAmount+=itemInfo.price*cartItems[items][item];
                    }
                } catch(error){

                }
            }
        }
        return totalAmount;
    }

    //Fetch products from backend, fallback to static if failed to fetch
    useEffect(()=>{
        fetch('/api/product/list')
          .then(res => res.json())
          .then(data => {
            if(data.success && Array.isArray(data.products)){
              const fixedProducts = data.products.map(product => ({
                ...product,
                image: product.images || product.image || [],
              }));
              const allProducts = [
                ...fixedProducts,
                ...staticProducts.filter(
                  sp => !fixedProducts.some(bp => bp._id === sp._id)
                )
              ];
              setProducts(allProducts);
            } else {
              setProducts(staticProducts);
            }
          })
          .catch((err)=>{
            console.error('Product fetch error:', err);
            setProducts(staticProducts);
          });
    },[]);

    useEffect(()=>{
    },[cartItems])

    const value = {
        products, currency, delivery_fee,
        search, setSearch, showSearch, setShowSearch,
        cartItems, setCartItems, addToCart,
        getCartCount, updateQuantity, clearCart,
        getCartAmount, navigate,
        backendUrl: 'http://localhost:3000',
        token: localStorage.getItem('token') || null,
        setToken: setToken
    }
    return (
        <ShopContext.Provider value={value}>
            {props.children}
        </ShopContext.Provider>
    )
}

export default ShopContextProvider;