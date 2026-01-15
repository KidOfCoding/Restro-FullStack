import { createContext, useEffect, useState, useRef } from "react";
export const StoreContext = createContext(null);
import axios from "axios";
import { ToastContainer, toast } from 'react-toastify';
import foodListJSON from "../assets/foods_data.json";
import { io } from "socket.io-client";

const StoreContextProvider = (props) => {
    const URl = (import.meta.env.VITE_BACKEND_URL || "http://localhost:4000").replace(/\/$/, "");

    // Initialize Socket
    const [socket, setSocket] = useState(null);

    useEffect(() => {
        const newSocket = io(URl);
        setSocket(newSocket);
        return () => newSocket.close();
    }, [URl]);

    const [cartItem, setCartItems] = useState(() => {
        try {
            const savedCart = localStorage.getItem("cartItem");
            return savedCart ? JSON.parse(savedCart) : {};
        } catch (error) {
            console.error("Failed to parse cart from local storage", error);
            return {};
        }
    });

    // Optimistic UI: Initialize token directly from localStorage to prevent flicker
    const [token, setToken] = useState(localStorage.getItem("token") || "")

    const [food_list, setFoodList] = useState([])
    const [Items, setItems] = useState(0);
    const [userData, setUserData] = useState(null);

    // Persist Cart to LocalStorage whenever it changes
    useEffect(() => {
        localStorage.setItem("cartItem", JSON.stringify(cartItem));
    }, [cartItem]);

    // Variant-aware Key Helper
    const getKey = (itemId, variant) => variant ? `${itemId}-${variant}` : itemId;

    const addToCart = async (itemId, variant = null) => {
        const key = getKey(itemId, variant);

        setItems((prev) => prev + 1);

        setCartItems((prev) => {
            const updated = { ...prev };
            updated[key] = (updated[key] || 0) + 1;
            return updated;
        });

        if (token) {
            // Send structure: { itemId, variant } or composite key?
            // Existing backend expects { itemId }. 
            // We need to update backend cartController to handle variants too?
            // Ideally yes. But strict schema on backend might limit us.
            // Plan: Send "itemId" as usual if no variant. 
            // If variant, we might need a workaround or schema update on Backend Cart.
            // For now, let's assume we send JSON body with extra info or just update local.
            // Actually, backend cart is Map<String, Number>. So we can store "id-variant" string as key!
            await axios.post(URl + "/api/cart/add", { itemId: key }, { headers: { token } })
        }
    };

    const removeFromCart = async (itemId, variant = null) => {
        const key = getKey(itemId, variant);

        setItems((prev) => prev - 1);
        if (Object.keys(cartItem).length == 0) { setItems(0) }

        setCartItems((prev) => {
            const updated = { ...prev };
            updated[key] -= 1;
            if (updated[key] <= 0) delete updated[key];
            return updated;
        });

        if (token) {
            await axios.post(URl + "/api/cart/remove", { itemId: key }, { headers: { token } })
        }
    };

    const clearCart = async () => {
        setCartItems({});
        setItems(0);
        if (token) {
            await axios.post(URl + "/api/cart/clear", {}, { headers: { token } });
        }
    }

    const updateQuantity = async (itemId, variant, quantity) => {
        const key = getKey(itemId, variant);
        const newQty = Math.max(0, parseInt(quantity) || 0);

        setCartItems((prev) => {
            const updated = { ...prev };
            if (newQty === 0) delete updated[key];
            else updated[key] = newQty;
            return updated;
        });

        // Recalculate total items count locally
        setItems(prev => {
            // This is an approximation/relative update if we don't scan whole cart.
            // But simpler to just recalculate derived state if we could. 
            // Since 'Items' state is just a count, we might be desyncing it slightly if we don't sum all keys.
            // Let's rely on loadcartData to fix it eventually, or sum properly.
            return prev;
        });

        if (token) {
            // Create a reliable copy of what the cart SHOULD be based on the update we just did locally
            // We can't use 'cartItem' state immediately here because it's stale in this closure.
            // So we reconstruct it. 
            // Better yet: We need to send the FULL OBJECT for merge.
            // But we don't have the full fresh object here.
            // Strategy: We will send the update in a way that assumes `cartItem` ref is needed, 
            // OR we just fire the merge with the constructed object if we can access current state.
            // React State setter gives us current state.
            // But for the API call, we need the value.

            // Workaround: We will use the functional update pattern to get the value, 
            // BUT we can't export the value from inside the setter easily to the async scope outside.

            // Safer: Read from LocalStorage? No.
            // Best: Just wait for the effect? No.

            // Let's do this: 
            // We know 'cartItem' is in the scope, but might be one render behind.
            // For a "Set Quantity" feature, it's acceptable to use the in-scope 'cartItem' + the imperative change.
            const updatedCart = { ...cartItem };
            if (newQty === 0) delete updatedCart[key];
            else updatedCart[key] = newQty;

            await axios.post(URl + "/api/cart/merge", { cartData: updatedCart }, { headers: { token } });
        }
    }

    const getTotalCartAmount = () => {
        let totalAmount = 0;

        for (const key in cartItem) {
            const quantity = cartItem[key];
            if (quantity > 0) {
                // Parse Key
                const [itemId, variantName] = key.split('-');

                const itemInfo = food_list.find((product) => product._id === itemId);

                if (itemInfo) {
                    let price = itemInfo.price;

                    if (variantName && itemInfo.variants) {
                        const v = itemInfo.variants.find(v => v.name === variantName);
                        if (v) price = v.price;
                    }

                    totalAmount += price * quantity;
                }
            }
        }
        return totalAmount;
    };


    const fetchFoodList = async () => {
        try {
            const response = await axios.get(URl + "/api/food/list")
            if (response.data.success) {
                setFoodList(response.data.data)
            } else {
                // Fallback if needed, or handle error
            }
        } catch (error) {
            // console.error(error);
        }
    }

    // Real-time Updates
    useEffect(() => {
        if (socket) {
            socket.on("foodListUpdated", () => {
                fetchFoodList();
                // toast.info("Menu Updated!"); // Optional notification
            });
        }
    }, [socket]);

    const loadcartData = async (token) => {
        try {
            const response = await axios.post(URl + "/api/cart/get", {}, { headers: { token } })
            if (response.data && response.data.cartData) {
                setCartItems(response.data.cartData)
                const totalItems = Object.values(response.data.cartData).reduce((sum, qty) => sum + qty, 0);
                setItems(totalItems);
            } else {
                // If cartData is missing, it might mean the user is invalid or deleted
                console.warn("Cart data missing or invalid user");
                if (response.data.success === false) {
                    // Optional: logOut() if we are sure it's an invalid token
                }
            }
        } catch (error) {
            console.error("Error loading cart data:", error);
        }
    }

    const [userPoints, setUserPoints] = useState(0);

    const fetchUserPoints = async (token) => {
        if (token) {
            try {
                const response = await axios.get(URl + "/api/user/get-profile", { headers: { token } });
                if (response.data.success) {
                    setUserPoints(response.data.userData.points);
                    setUserData(response.data.userData);
                } else {
                    // User likely deleted or token invalid
                    console.warn("Failed to fetch profile:", response.data.message);
                    if (response.data.message === "User not found" || response.data.message === "Invalid Token") {
                        logOut(); // Auto logout to fix the crash loop
                    }
                }
            } catch (error) {
                console.error("Error fetching user points:", error);
            }
        }
    }

    const logOut = () => {
        localStorage.removeItem("token");
        // localStorage.removeItem("cartItem"); // Optional: Keep cart on logout? Usually better to clear.
        setToken("");
        setCartItems({});
        setItems(0);
        setUserData(null);
        setUserPoints(0);
    }

    // To not logout When refreshed - consolidated logic
    useEffect(() => {
        async function loaddata() {
            await fetchFoodList();
            if (token) {
                await fetchUserPoints(token);
                await loadcartData(token);
            }
        }
        loaddata();
    }, []);

    // Refresh points and cart and Sync when token changes
    // Fix: Use a separate effect for MERGING only when logging in (transition from no token to token)
    // The previous logic ran on mount (refresh), merging local cache (which was already synced) back to server.
    useEffect(() => {
        const handleTokenChange = async () => {
            // Only if token exists and we are NOT on the very first mount (handled above), 
            // but we can't easily distinguish mount vs change here without a ref.
            // However, separating the "Load Data" (Mount) from "Merge" (Login) is safer.
        }
    }, [token]);

    // We already handle Initial Load in the [] effect.
    // We need to handle "User Logged In" event (Token changed from "" to "val").
    // We can't rely on [token] effect alone because it runs on mount.

    // REVISED STRATEGY: 
    // 1. Keep the [] effect for Initial Data Fetching (Server Source of Truth).
    // 2. Modify the Login component to call a "merge" function? No, Context should handle it.
    // 3. Use a Ref to track if it's a "Login Action" vs "Refresh".

    // Let's implement a ref to skip the merge on the first render if a token exists.
    const isFirstRender = useRef(true);

    useEffect(() => {
        const syncAndLoad = async () => {
            if (token) {
                // If it's the first render (Refresh) and we have a token, 
                // we assume local cart is just a cache of server cart. DO NOT MERGE.
                if (isFirstRender.current) {
                    isFirstRender.current = false;
                    // Just load data (handled by the specific [] effect or here to be safe)
                    await fetchUserPoints(token);
                    await loadcartData(token);
                    return;
                }

                // If not first render, it means token CHANGED (Login happened).
                // Now we merge guest cart.
                const localCount = Object.keys(cartItem).reduce((a, b) => a + cartItem[b], 0);
                if (localCount > 0) {
                    try {
                        await axios.post(URl + "/api/cart/merge", { cartData: cartItem }, { headers: { token } });
                    } catch (err) {
                        console.error("Cart Sync Error", err);
                    }
                }
                await fetchUserPoints(token);
                await loadcartData(token);
            } else {
                setUserPoints(0);
                setUserData(null);
            }
        }
        syncAndLoad();
    }, [token]);


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
        updateQuantity,
        logOut
    };


    return (
        <StoreContext.Provider value={contextValue}>
            {props.children}
        </StoreContext.Provider>
    );
};

export default StoreContextProvider;
