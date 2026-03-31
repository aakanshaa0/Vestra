import userModel from '../models/userModel.js';

const addToCart = async (req, res) => {
    try {
        const { itemId, size } = req.body;
        const userId = req.user.id;

        const user = await userModel.findById(userId);
        if (!user) {
            return res.json({ success: false, message: "User not found" });
        }

        let cartData = user.cartData || {};

        if (!cartData[itemId]) {
            cartData[itemId] = {};
        }

        if (cartData[itemId][size]) {
            cartData[itemId][size] += 1;
        } else {
            cartData[itemId][size] = 1;
        }

        await userModel.findByIdAndUpdate(userId, { cartData });

        res.json({ success: true, message: "Item added to cart", cartData });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

const updateCart = async (req, res) => {
    try {
        const { itemId, size, quantity } = req.body;
        const userId = req.user.id;

        const user = await userModel.findById(userId);
        if (!user) {
            return res.json({ success: false, message: "User not found" });
        }

        let cartData = user.cartData || {};

        if (quantity > 0) {
            if (!cartData[itemId]) {
                cartData[itemId] = {};
            }
            cartData[itemId][size] = quantity;
        } else {
            if (cartData[itemId]) {
                delete cartData[itemId][size];
                if (Object.keys(cartData[itemId]).length === 0) {
                    delete cartData[itemId];
                }
            }
        }

        await userModel.findByIdAndUpdate(userId, { cartData });

        res.json({ success: true, message: "Cart updated", cartData });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

const getCart = async (req, res) => {
    try {
        const userId = req.user.id;

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

const clearCart = async (req, res) => {
    try {
        const userId = req.user.id;

        await userModel.findByIdAndUpdate(userId, { cartData: {} });

        res.json({ success: true, message: "Cart cleared successfully" });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

//Sync cart from frontend to backend(for when user logs in)
const syncCart = async (req, res) => {
    try {
        const { cartData } = req.body;
        const userId = req.user.id;

        await userModel.findByIdAndUpdate(userId, { cartData: cartData || {} });

        res.json({ success: true, message: "Cart synced successfully", cartData });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

export { addToCart, updateCart, getCart, clearCart, syncCart };
