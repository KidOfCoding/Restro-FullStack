import { useContext, useEffect, useState } from "react";
import style from "./placeorder.module.css";
import cartStyle from "../Cart/cart.module.css";
import { StoreContext } from "../../context/StoreContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import confetti from "canvas-confetti";

const PlaceOrder = () => {
  const {
    getTotalCartAmount,
    token,
    food_list,
    cartItem,
    URl,
    userPoints,
    userData,
    setCartItems,
    setItems
  } = useContext(StoreContext);

  const navigate = useNavigate();

  /* ---------------- STATES ---------------- */
  const [orderType, setOrderType] = useState("Delivery");
  const [address, setAddress] = useState("");
  const [usePoints, setUsePoints] = useState(false);

  const [savedAddresses, setSavedAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState("");
  const [saveThisAddress, setSaveThisAddress] = useState(false);
  const [addressLabel, setAddressLabel] = useState("Home");

  const [orderSuccess, setOrderSuccess] = useState(false);
  const [earnedPoints, setEarnedPoints] = useState(0);

  /* ---------------- FETCH SAVED ADDRESSES ---------------- */
  const fetchSavedAddresses = async () => {
    try {
      const res = await axios.get(URl + "/api/user/get-profile", {
        headers: { token }
      });
      if (res.data.success && res.data.userData.addresses) {
        setSavedAddresses(res.data.userData.addresses);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (token) fetchSavedAddresses();
  }, [token]);

  /* ---------------- REDIRECT GUARDS ---------------- */
  useEffect(() => {
    if (!token || getTotalCartAmount() === 0) {
      navigate("/cart");
    }
  }, [token]);

  /* ---------------- ADDRESS SELECT ---------------- */
  const handleAddressSelect = (e) => {
    const id = e.target.value;
    setSelectedAddressId(id);
    const found = savedAddresses.find((a) => a._id === id);
    setAddress(found ? found.address : "");
  };

  /* ---------------- RAZORPAY ---------------- */
  const loadRazorpayScript = () =>
    new Promise((resolve) => {
      if (window.Razorpay) {
        resolve(true);
        return;
      }
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });

  useEffect(() => {
    loadRazorpayScript();
  }, []);

  /* ---------------- PLACE ORDER ---------------- */
  const placeOrder = async (e, bypass = false) => {
    if (e) e.preventDefault();
    try {
      if (!token) return;

      if (orderType === "Delivery" && saveThisAddress && address) {
        await axios.post(
          URl + "/api/user/save-address",
          { address, label: addressLabel },
          { headers: { token } }
        );
      }

      const items = [];
      food_list.forEach((item) => {
        if (cartItem[item._id] > 0) {
          items.push({ ...item, quantity: cartItem[item._id] });
        }
      });

      const finalAddress =
        orderType === "Delivery"
          ? {
            street: address,
            firstName: userData?.name || "Guest",
            lastName: "",
            email: userData?.email || "",
            phone: userData?.phone || ""
          }
          : {
            street:
              orderType === "Dine-in"
                ? `Table: ${address}`
                : "Takeaway Order",
            firstName: userData?.name || "Guest",
            lastName: `(${orderType})`,
            email: userData?.email || "",
            phone: userData?.phone || ""
          };

      const orderData = {
        address: finalAddress,
        items,
        orderType,
        pointsToUse: usePoints ? userPoints : 0,
        amount: Math.max(
          0,
          getTotalCartAmount() - (usePoints ? userPoints : 0)
        ),
        bypassPayment: bypass
      };

      const res = await axios.post(
        URl + "/api/order/place",
        orderData,
        { headers: { token } }
      );

      if (!res.data.success) {
        toast.error("Order Failed: " + (res.data.message || "Unknown error"));
        return;
      }

      // Handle Bypass or Immediate Success
      if (res.data.success && !res.data.key) {
        if (res.data.pointsEarned) {
          setEarnedPoints(res.data.pointsEarned);
        }
        setOrderSuccess(true);
        setCartItems({});
        setItems(0);
        setTimeout(() => navigate("/myorders"), 3500);
        return;
      }

      const loaded = await loadRazorpayScript();
      if (!loaded) {
        toast.error("Razorpay not loaded");
        return;
      }

      const options = {
        key: res.data.key,
        amount: res.data.order.amount,
        currency: "INR",
        name: "Restro77",
        description: "Food Order",
        order_id: res.data.order.id,
        handler: async (response) => {
          try {
            const verify = await axios.post(
              URl + "/api/order/verify-razorpay",
              {
                ...response,
                orderId: res.data.orderId
              }
            );

            if (verify.data.success) {
              confetti({ particleCount: 120, spread: 80 });
              setEarnedPoints(verify.data.pointsEarned || 0);
              setOrderSuccess(true);
              setCartItems({});
              setItems(0);
              setTimeout(() => navigate("/myorders"), 3500);
            } else {
              toast.error("Payment Verification Failed");
            }
          } catch (error) {
            console.log(error);
            toast.error("Payment Verification Error");
          }
        },
        prefill: {
          name: finalAddress.firstName,
          email: finalAddress.email,
          contact: finalAddress.phone
        },
        theme: { color: "#ff6347" }
      };

      new window.Razorpay(options).open();
    } catch (error) {
      console.error("Place Order Error:", error);
      if (error.response && error.response.status === 429) {
        toast.error("Server busy (Too Many Requests). Please wait a moment and try again.");
      } else {
        toast.error("Something went wrong while placing the order.");
      }
    }
  };

  /* ---------------- JSX ---------------- */
  return (
    <form className={style.placeOrder} onSubmit={placeOrder}>
      {/* LEFT */}
      <div className={style.placeOrderLeft}>
        <h2 className={style.title}>Order Options</h2>

        <div className={style.orderTypeGroup}>
          {["Delivery", "Dine-in", "Takeaway"].map((type) => (
            <label key={type} className={style.radioLabel}>
              <input
                type="radio"
                name="orderType"
                value={type}
                checked={orderType === type}
                onChange={() => {
                  setOrderType(type);
                  setAddress("");
                }}
              />
              {type}
            </label>
          ))}
        </div>

        {orderType === "Delivery" && (
          <>
            {savedAddresses.length > 0 && (
              <select value={selectedAddressId} onChange={handleAddressSelect}>
                <option value="">Select saved address</option>
                {savedAddresses.map((a) => (
                  <option key={a._id} value={a._id}>
                    {a.label}
                  </option>
                ))}
              </select>
            )}

            <textarea
              placeholder="Enter delivery address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              required
            />

            <label className={style.checkboxRow}>
              <input
                type="checkbox"
                checked={saveThisAddress}
                onChange={(e) => setSaveThisAddress(e.target.checked)}
              />
              Save this address
            </label>

            {saveThisAddress && (
              <input
                placeholder="Label (Home / Work)"
                value={addressLabel}
                onChange={(e) => setAddressLabel(e.target.value)}
              />
            )}
          </>
        )}

        {orderType === "Dine-in" && (
          <input
            placeholder="Enter Table Number"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            required
          />
        )}

        {userData && (
          <div className={style.infoBox}>
            <p><b>Name:</b> {userData.name}</p>
            <p><b>Phone:</b> {userData.phone}</p>
            <p><b>Email:</b> {userData.email}</p>
          </div>
        )}
      </div>

      {/* RIGHT */}
      <div className={style.placeOrderRight}>
        <div className={cartStyle.CartTotal}>
          <h2>Cart Total</h2>

          <div className={cartStyle.cartTotalDetails}>
            <span>Subtotal : </span>
            <span>₹{getTotalCartAmount()}</span>
          </div>

          {(userPoints > 0 && getTotalCartAmount() >= 50) && (
            <label className={style.checkboxRow}>
              <input
                type="checkbox"
                checked={usePoints}
                onChange={(e) => setUsePoints(e.target.checked)}
              />
              Use {userPoints} Points
            </label>
          )}

          <div className={cartStyle.cartTotalDetails}>
            <b>Total :</b>
            <b>
              &nbsp; ₹{Math.max(0, getTotalCartAmount() - (usePoints ? userPoints : 0))}
            </b>
          </div>

          <button type="submit">Proceed to Payment</button>
          {userData?.phone === "8596962616" && (
            <button
              type="button"
              onClick={() => placeOrder(null, true)}
              style={{ marginTop: "10px", backgroundColor: "#333" }}
            >
              Complete Order (Admin)
            </button>
          )}
        </div>
      </div>

      {/* SUCCESS MODAL */}
      {orderSuccess && (
        <div className={style.successOverlay}>
          <div className={`${style.successBox} ${style.animateBounce}`}>
            <div className={style.checkIcon}>✨</div>
            <h2>Order Placed!</h2>
            <div className={style.successPoints}>
              <span>+{earnedPoints}</span> Points
            </div>
            <p className={style.redirectText}>Redirecting to your orders...</p>
          </div>
        </div>
      )}
    </form>
  );
};

export default PlaceOrder
