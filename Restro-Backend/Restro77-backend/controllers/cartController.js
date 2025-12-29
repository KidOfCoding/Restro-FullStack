import userModel from '../models/userModel.js'

// Add Items to cart
const addToCart = async (req, res) => {
    try {
        let userData = await userModel.findById(req.body.userId);
        let cartData = await userData.cartData;
        if (!cartData[req.body.itemId]) {
            cartData[req.body.itemId] = 1
        } else {
            cartData[req.body.itemId] += 1
        }

        await userModel.findByIdAndUpdate(req.body.userId, { cartData })
        res.json({ success: true, message: "Added to Cart" })
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" })
    }
}

// Remove Items from cart
const removeFromCart = async (req, res) => {
    try {
        let userData = await userModel.findById(req.body.userId);
        let cartData = await userData.cartData;
        if (cartData[req.body.itemId] > 0) {
            cartData[req.body.itemId] -= 1;
        }

        await userModel.findByIdAndUpdate(req.body.userId, { cartData })
        res.json({ success: true, message: "Removed From Cart" })
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" })

    }
}

// Fetch Cart Data
const getCart = async (req, res) => {
    try {
        let userData = await userModel.findById(req.body.userId);
        let cartData = await userData.cartData;
        res.json({ success: true, cartData })
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: " Error" })
    }
}

// Clear Cart
const clearCart = async (req, res) => {
    try {
        let userData = await userModel.findById(req.body.userId);
        let cartData = await userData.cartData;

        // Reset cart logic: either set to empty object or zero out existing keys? 
        // Setting to empty object is safer if we want to remove everything.
        // Based on addToCart, it expects keys. 
        // Let's just set it to empty object in DB.

        await userModel.findByIdAndUpdate(req.body.userId, { cartData: {} });
        res.json({ success: true, message: "Cart Cleared" })
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" })
    }
}

export { addToCart, removeFromCart, getCart, clearCart }