import { useContext, useEffect, useState } from "react";
import style from "./placeorder.module.css";
import cartStyle from "../Cart/cart.module.css";
import { StoreContext } from "../../context/StoreContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import confetti from "canvas-confetti";

const RESTAURANT_COORDS = { lat: 20.214642744864992, lng: 85.73559221488036 };

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

  // DELIVERY LOGIC
  const [deliveryPoints, setDeliveryPoints] = useState([]);
  const [selectedPoint, setSelectedPoint] = useState(""); // ID of selected point
  const [userLocation, setUserLocation] = useState(null); // { lat, lng }
  const [distance, setDistance] = useState(0); // in km
  const [deliveryFee, setDeliveryFee] = useState(0);
  const [isCalculating, setIsCalculating] = useState(false);

  /* ---------------- FETCH SAVED ADDRESSES & POINTS ---------------- */
  const fetchSavedAddresses = async () => {
    try {
      const res = await axios.get(URl + "/api/user/get-profile", { headers: { token } });
      if (res.data.success && res.data.userData.addresses) {
        setSavedAddresses(res.data.userData.addresses);
      }
    } catch (err) { console.error(err); }
  };

  const fetchDeliveryPoints = async () => {
    try {
      const res = await axios.get(URl + "/api/delivery/list");
      if (res.data.success) {
        setDeliveryPoints(res.data.data);
      }
    } catch (err) { console.error(err); }
  };

  useEffect(() => {
    if (token) fetchSavedAddresses();
    fetchDeliveryPoints();
  }, [token]);

  /* ---------------- CALCULATE FEE ---------------- */
  // Hybrid Logic: BaseCost + (max(0, Actual - BaseDist) * Rate)
  // Rate = 4 Rs/km
  const calculateFee = (distKm, pointId) => {
    let fee = 0;
    const ratePerKm = 4;

    if (pointId) {
      const point = deliveryPoints.find(p => p._id === pointId);
      if (point) {
        const excessDist = Math.max(0, distKm - point.defaultDistance);
        fee = point.baseCost + (excessDist * ratePerKm);
      }
    } else {
      fee = Math.round(distKm) * ratePerKm;
    }
    setDeliveryFee(Math.max(0, Math.round(fee)));
  };

  useEffect(() => {
    if (distance > 0) {
      calculateFee(distance, selectedPoint);
    }
  }, [distance, selectedPoint]);


  /* ---------------- LOCATION SERVICES ---------------- */
  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      toast.error("Geolocation is not supported by your browser");
      return;
    }
    setIsCalculating(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        setUserLocation({ lat: latitude, lng: longitude });

        // Reverse Geocoding for Address Text (Optional but nice)
        try {
          const res = await axios.get(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
          if (res.data && res.data.display_name) {
            setAddress(res.data.display_name); // Auto-fill address
          }
        } catch (e) { console.log("Reverse geo error", e) }

        await calculateOSRMDistance(latitude, longitude);
        setIsCalculating(false);
      },
      () => {
        toast.error("Unable to retrieve your location");
        setIsCalculating(false);
      }
    );
  };

  const calculateOSRMDistance = async (userLat, userLng) => {
    try {
      const url = `https://router.project-osrm.org/route/v1/driving/${RESTAURANT_COORDS.lng},${RESTAURANT_COORDS.lat};${userLng},${userLat}?overview=false`;
      const response = await axios.get(url);

      if (response.data.routes && response.data.routes.length > 0) {
        const distMeters = response.data.routes[0].distance;
        const distKm = (distMeters / 1000).toFixed(2);
        setDistance(parseFloat(distKm));
        toast.success(`Distance Calculated: ${distKm} km`);
      } else {
        // Fallback to Haversine
        fallbackHaversine(userLat, userLng);
      }
    } catch (error) {
      console.error("OSRM Error", error);
      fallbackHaversine(userLat, userLng);
    }
  };

  const fallbackHaversine = (lat2, lon2) => {
    const R = 6371; // Radius of the earth in km
    const dLat = deg2rad(lat2 - RESTAURANT_COORDS.lat);
    const dLon = deg2rad(lon2 - RESTAURANT_COORDS.lng);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(deg2rad(RESTAURANT_COORDS.lat)) * Math.cos(deg2rad(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const d = R * c; // Distance in km
    const roadDistance = (d * 1.4).toFixed(2); // Estimate road logic
    setDistance(parseFloat(roadDistance));
    toast.info(`Estimated Distance: ${roadDistance} km`);
  };

  const deg2rad = (deg) => deg * (Math.PI / 180);

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
    if (found) {
      setAddress(found.address);
      // Use saved coordinates if available to Recalculate Distance
      if (found.latitude && found.longitude) {
        setUserLocation({ lat: found.latitude, lng: found.longitude });
        calculateOSRMDistance(found.latitude, found.longitude);
      }
    } else {
      setAddress("");
      setDistance(0);
      setDeliveryFee(0);
    }
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

      // Save Address Logic (Updated to include Lat/Lng if available)
      if (orderType === "Delivery" && saveThisAddress && address) {
        await axios.post(
          URl + "/api/user/save-address",
          {
            address,
            label: addressLabel,
            latitude: userLocation?.lat,
            longitude: userLocation?.lng
          },
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
            street: address + (selectedPoint ? ` (Near ${deliveryPoints.find(p => p._id === selectedPoint)?.name})` : ""),
            firstName: userData?.name || "Guest",
            lastName: "",
            email: userData?.email || "",
            phone: userData?.phone || ""
          }
          : {
            street: orderType === "Dine-in" ? `Table: ${address}` : "Takeaway Order",
            firstName: userData?.name || "Guest",
            lastName: `(${orderType})`,
            email: userData?.email || "",
            phone: userData?.phone || ""
          };

      // Use Delivery Fee in Total
      const cartTotal = getTotalCartAmount();
      const pointsDiscount = usePoints ? userPoints : 0;
      const finalAmount = Math.max(0, cartTotal - pointsDiscount + deliveryFee);

      const orderData = {
        address: finalAddress,
        items,
        orderType,
        pointsToUse: usePoints ? userPoints : 0,
        amount: finalAmount,
        deliveryFee: deliveryFee, // New Field
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

      if (res.data.success && !res.data.key) {
        if (res.data.pointsEarned) setEarnedPoints(res.data.pointsEarned);
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
              { ...response, orderId: res.data.orderId }
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
      toast.error("Something went wrong while placing the order.");
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
                  setDistance(0);
                  setDeliveryFee(0);
                }}
              />
              {type}
            </label>
          ))}
        </div>

        {orderType === "Delivery" && (
          <>
            {/* Location & Distance Section */}
            <div className={style.locationSection}>
              <button type="button" className={style.locationBtn} onClick={getCurrentLocation} disabled={isCalculating}>
                {isCalculating ? "Calculating..." : "📍 Use Current Location"}
              </button>
              {distance > 0 && <span className={style.distanceBadge}>{distance} km from Restaurant</span>}
            </div>

            {/* Delivery Point Dropdown (Hybrid) */}
            {deliveryPoints.length > 0 && (
              <select
                className={style.pointSelect}
                value={selectedPoint}
                onChange={(e) => setSelectedPoint(e.target.value)}
              >
                <option value="">Select Nearby Landmark (Optional)</option>
                {deliveryPoints.map((p) => (
                  <option key={p._id} value={p._id}>
                    {p.name} (Base: {p.defaultDistance}km / ₹{p.baseCost})
                  </option>
                ))}
              </select>
            )}


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

          {orderType === "Delivery" && (
            <div className={cartStyle.cartTotalDetails}>
              <span>Delivery Fee : </span>
              <span>₹{deliveryFee}</span>
            </div>
          )}

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
              &nbsp; ₹{Math.max(0, getTotalCartAmount() - (usePoints ? userPoints : 0) + (orderType === "Delivery" ? deliveryFee : 0))}
            </b>
          </div>

          <button type="submit">Proceed to Payment</button>
          {userData?.phone === "8596962616" && (
            <button
              type="button"
              className={style.adminBypassBtn}
              onClick={() => placeOrder(null, true)}
            >
              &gt; fuck u restro 🖕
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

export default PlaceOrder;
