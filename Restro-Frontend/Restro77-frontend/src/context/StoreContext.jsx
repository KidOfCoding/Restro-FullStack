import { createContext, useEffect, useState } from "react";
export const StoreContext = createContext(null);
import axios from "axios";
import { ToastContainer, toast } from 'react-toastify';
import foodListJSON from "../assets/foods_data.json";

const StoreContextProvider = (props) => {
    const [cartItem, setCartItems] = useState(() => {
        try {
            const savedCart = localStorage.getItem("cartItem");
            return savedCart ? JSON.parse(savedCart) : {};
        } catch (error) {
            console.error("Failed to parse cart from local storage", error);
            return {};
        }
    });

    const URl = (import.meta.env.VITE_BACKEND_URL || "http://localhost:4000").replace(/\/$/, "");

    // Optimistic UI: Initialize token directly from localStorage to prevent flicker
    const [token, setToken] = useState(localStorage.getItem("token") || "")

    const [food_list, setFoodList] = useState([])
    const [Items, setItems] = useState(0);
    const [userData, setUserData] = useState(null);

    // Persist Cart to LocalStorage whenever it changes
    useEffect(() => {
        localStorage.setItem("cartItem", JSON.stringify(cartItem));
    }, [cartItem]);

    const addToCart = async (itemId) => {
        if (!token) {
            toast.warn('Please Signin to Proceed', {
                position: "top-center",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: false,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "dark",
            });
            return;
        }

        setItems((prev) => prev + 1);
        if (!cartItem[itemId]) {
            setCartItems((prev) => ({ ...prev, [itemId]: 1 }));

        } else {
            setCartItems((prev) => ({ ...prev, [itemId]: prev[itemId] + 1 }));
        }

        if (token) {
            await axios.post(URl + "/api/cart/add", { itemId }, { headers: { token } })
        }

    };

    const removeFromCart = async (itemId) => {
        setItems((prev) => prev - 1);
        if (Object.keys(cartItem).length == 0) { setItems(0) }
        setCartItems((prev) => ({ ...prev, [itemId]: prev[itemId] - 1 }));
        if (token) {
            await axios.post(URl + "/api/cart/remove", { itemId }, { headers: { token } })
        }
    };

    const clearCart = async () => {
        setCartItems({});
        setItems(0);
        if (token) {
            await axios.post(URl + "/api/cart/clear", {}, { headers: { token } });
        }
    }

    const getTotalCartAmount = () => {
        let totalAmount = 0;

        for (const itemId in cartItem) {
            const quantity = cartItem[itemId];

            if (quantity > 0) {
                const itemInfo = food_list.find(
                    (product) => product._id.toString() === itemId
                );
                if (itemInfo) {
                    totalAmount += itemInfo.price * quantity;
                }
            }
        }

        console.log(totalAmount);
        return totalAmount;
    };


    const fetchFoodList = async () => {
        // const response = await axios.get(URl + "/api/food/list")
        // setFoodList(response.data.data)
        // setFoodList(response.data.data)

        const keepTest = import.meta.env.VITE_KEEP_TEST;

        if (keepTest === '1') {
            const testItem = {
                _id: "test_item_1",
                name: "Test Verification Item (₹2)",
                image: "food_1.png", // Kept for compatibility if needed later
                price: 2,
                description: "A dummy item to verify payment flow",
                category: "noodles", // Appear in first category
                type: "veg"
            };
            // Add test item to the beginning
            setFoodList([testItem, ...foodListJSON])
        } else {
            setFoodList(foodListJSON);
        }
    }

    const loadcartData = async (token) => {
        const response = await axios.post(URl + "/api/cart/get", {}, { headers: { token } })
        setCartItems(response.data.cartData)
        const totalItems = Object.values(response.data.cartData).reduce((sum, qty) => sum + qty, 0);

        setItems(totalItems);
    }

    const [userPoints, setUserPoints] = useState(0);

    const fetchUserPoints = async (token) => {
        if (token) {
            const response = await axios.get(URl + "/api/user/get-profile", { headers: { token } });
            if (response.data.success) {
                setUserPoints(response.data.userData.points);
                setUserData(response.data.userData);
            }
        }
    }

    const logOut = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("cartItem");
        setToken("");
        setCartItems({});
        setItems(0);
        setUserData(null);
        setUserPoints(0);
    }

    // To not logout When refreshed
    useEffect(() => {
        async function loaddata() {
            await fetchFoodList()
            if (token) {
                // Token is already set from state initialization, just load data
                await loadcartData(token);
                await fetchUserPoints(token);
            }
        }
        loaddata()
    }, [])

    // Refresh points and cart when token changes
    useEffect(() => {
        if (token) {
            fetchUserPoints(token);
            loadcartData(token);
        } else {
            setUserPoints(0);
            setUserData(null);
            setCartItems({});
            setItems(0);
        }
    }, [token])


    const contextValue = {
        food_list,
        cartItem,
        setCartItems,
        addToCart,
        removeFromCart,
        clearCart,
        getTotalCartAmount,
        URl,
        token,
        setToken,
        Items,
        setItems,
        userPoints,
        userData,
        fetchUserPoints,
        logOut
    };


    return (
        <StoreContext.Provider value={contextValue}>
            {props.children}
        </StoreContext.Provider>
    );
};

export default StoreContextProvider;
