import userModel from '../models/userModel.js';

// Add item to user's cart
const addToCart = async (req, res) => {
    try {
        const { itemId, size } = req.body;
        const userId = req.user.id;

        // Find the user
        const user = await userModel.findById(userId);
        if (!user) {
            return res.json({ success: false, message: "User not found" });
        }

        // Get current cart data or initialize empty cart
        let cartData = user.cartData || {};

        // Add item to cart (same logic as frontend)
        if (!cartData[itemId]) {
            cartData[itemId] = {};
        }

        if (cartData[itemId][size]) {
            cartData[itemId][size] += 1;
        } else {
            cartData[itemId][size] = 1;
        }

        // Update user's cart in database
        await userModel.findByIdAndUpdate(userId, { cartData });

        res.json({ success: true, message: "Item added to cart", cartData });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

// Update item quantity in cart
const updateCart = async (req, res) => {
    try {
        const { itemId, size, quantity } = req.body;
        const userId = req.user.id;

        // Find the user
        const user = await userModel.findById(userId);
        if (!user) {
            return res.json({ success: false, message: "User not found" });
        }

        let cartData = user.cartData || {};

        // Update quantity (same logic as frontend)
        if (quantity > 0) {
            if (!cartData[itemId]) {
                cartData[itemId] = {};
            }
            cartData[itemId][size] = quantity;
        } else {
            // Remove item if quantity is 0
            if (cartData[itemId]) {
                delete cartData[itemId][size];
                // Remove product entry if no sizes left
                if (Object.keys(cartData[itemId]).length === 0) {
                    delete cartData[itemId];
                }
            }
        }

        // Update user's cart in database
        await userModel.findByIdAndUpdate(userId, { cartData });

        res.json({ success: true, message: "Cart updated", cartData });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

// Get user's cart
const getCart = async (req, res) => {
    try {
        const userId = req.user.id;

        // Find the user and get cart data
        const user = await userModel.findById(userId);
        if (!user) {
            return res.json({ success: false, message: "User not found" });
        }

        const cartData = user.cartData || {};
        res.json({ success: true, cartData });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

// Clear user's entire cart
const clearCart = async (req, res) => {
    try {
        const userId = req.user.id;

        // Clear user's cart in database
        await userModel.findByIdAndUpdate(userId, { cartData: {} });

        res.json({ success: true, message: "Cart cleared successfully" });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

// Sync cart from frontend to backend (for when user logs in)
const syncCart = async (req, res) => {
    try {
        const { cartData } = req.body;
        const userId = req.user.id;

        // Update user's cart with frontend cart data
        await userModel.findByIdAndUpdate(userId, { cartData: cartData || {} });

        res.json({ success: true, message: "Cart synced successfully", cartData });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

export { addToCart, updateCart, getCart, clearCart, syncCart };
