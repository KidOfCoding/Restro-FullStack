import { useContext, useEffect, useState } from 'react'
import style from './placeorder.module.css'
import style1 from '../Cart/cart.module.css'
import { StoreContext } from '../../context/StoreContext'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'

const PlaceOrder = () => {

  const { getTotalCartAmount, token, food_list, cartItem, URl, userPoints, userData } = useContext(StoreContext)

  const [address, setAddress] = useState("");
  const [usePoints, setUsePoints] = useState(false);
  const [locationLoading, setLocationLoading] = useState(false);

  // Saved Addresses State
  const [savedAddresses, setSavedAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState("");
  const [saveThisAddress, setSaveThisAddress] = useState(false);
  const [addressLabel, setAddressLabel] = useState("Home");

  const fetchSavedAddresses = async () => {
    if (token && userData) {
      try {
        // We can rely on userData from context if it's updated, 
        // but to be sure let's fetch profile or just rely on userData if it has addresses
        // Since context might not carry addresses array yet without refresh, let's fetch profile explicitly
        const response = await axios.get(URl + "/api/user/get-profile", { headers: { token } });
        if (response.data.success && response.data.userData.addresses) {
          setSavedAddresses(response.data.userData.addresses);
        }
      } catch (error) {
        console.log("Error fetching addresses", error);
      }
    }
  }

  useEffect(() => {
    fetchSavedAddresses();
  }, [token, userData]); // Re-run when userData availability changes

  const handleAddressSelect = (e) => {
    const addrId = e.target.value;
    setSelectedAddressId(addrId);
    if (addrId === "") {
      setAddress("");
      return;
    }
    const selected = savedAddresses.find(a => a._id === addrId);
    if (selected) {
      setAddress(selected.address);
    }
  }

  const fetchLocation = async () => {
    if (!token) return;
    try {
      const response = await axios.get(URl + "/api/user/get-profile", { headers: { token } });
      console.log(response.data);

      if (response.data.success) {
        setAddress(response.data.userData.address);
      }
    } catch (error) {
      console.error(error);
    }

    // if (navigator.geolocation) {
    //   setLocationLoading(true);
    //   toast.info("Fetching Location...", { autoClose: 1500 });
    //   navigator.geolocation.getCurrentPosition(async (position) => {
    //     const { latitude, longitude } = position.coords;
    //     try {
    //       // Use Backend Proxy to avoid CORS and set User-Agent
    //       const response = await axios.get(URl + "/api/user/get-address", {
    //         params: { lat: latitude, lng: longitude },
    //         headers: { token }
    //       });

    //       if (response.data && response.data.success) {
    //         setAddress(response.data.address);
    //         setLocationLoading(false);
    //         toast.success("Location Fetched!");
    //       } else {
    //         toast.error("Could not fetch address details.");
    //         setAddress(`${latitude}, ${longitude}`); // Fallback
    //         setLocationLoading(false);
    //       }
    //     } catch (error) {
    //       console.error("Geocoding error:", error);
    //       setAddress(`${latitude}, ${longitude}`); // Fallback
    //       setLocationLoading(false);
    //       toast.warn("Could not get details address, using coordinates.");
    //     }
    //   }, (error) => {
    //     console.error("Geolocation error:", error);
    //     toast.error("Location permission denied.");
    //     setLocationLoading(false);
    //   });
    // } else {
    //   toast.error("Geolocation not supported.");
    // }

  }
  useEffect(async () => {
    await fetchLocation();
  }, [])
  const placeOrder = async (event) => {
    event.preventDefault();
    console.log(address);
    console.log(token);
    console.log(userData);


    if (!token) return;
    try {
      const response = await axios.put(URl + "/api/user/updateAddress", { email: userData?.email, address }, { headers: { token } });
      console.log(response.data);
      setAddress(response.data.userData.address)
    } catch (error) {
      console.error(error);
    }

    // Save Address if checked
    if (saveThisAddress && address) {
      try {
        await axios.post(URl + "/api/user/save-address", { address, label: addressLabel }, { headers: { token } });
        toast.success("Address Saved to File");
      } catch (error) {
        console.error("Failed to save address", error);
      }
    }

    let orderItems = [];
    food_list.map((item) => {
      if (cartItem[item._id] > 0) {
        let itemInfo = item;
        itemInfo["quantity"] = cartItem[item._id]
        orderItems.push(itemInfo)
      }
    })

    // Construct simplified order data with profile info
    let orderData = {
      address: {
        street: address, // Map single address string to street for compatibility
        firstName: userData?.name || "Guest",
        lastName: "",
        email: userData?.email || "",
        phone: userData?.phone || ""
      },
      items: orderItems,
      amount: getTotalCartAmount() + 5 - (usePoints ? userPoints : 0),
      pointsToUse: usePoints ? userPoints : 0
    }

    if (orderData.amount < 0) orderData.amount = 0;

    let response = await axios.post(URl + "/api/order/place", orderData, { headers: { token } })
    if (response.data.success) {
      const { payuParams } = response.data;

      const form = document.createElement('form');
      form.action = "https://test.payu.in/_payment";
      form.method = "POST";

      for (const key in payuParams) {
        const input = document.createElement('input');
        input.type = 'hidden';
        input.name = key;
        input.value = payuParams[key];
        form.appendChild(input);
      }
      document.body.appendChild(form);
      form.submit();

    } else {
      console.log(response.data.message)
      toast.error("Order Failed")
    }
  }

  const navigate = useNavigate()

  useEffect(() => {
    if (!token) {
      navigate('/cart')
    } else if (getTotalCartAmount() === 0) {
      navigate("/cart")
    }
  }, [token])

  return (
    <form onSubmit={placeOrder} className={style.placeOrder}>
      <div className={style.placeOrderLeft}>
        <p className={style.title}>Delivery Details</p>

        <div style={{ marginBottom: "20px" }}>

          {savedAddresses.length > 0 && (
            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px', color: '#555' }}>Select Saved Address</label>
              <select
                value={selectedAddressId}
                onChange={handleAddressSelect}
                style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }}
              >
                <option value="">-- Choose from saved addresses --</option>
                {savedAddresses.map(addr => (
                  <option key={addr._id} value={addr._id}>{addr.label}: {addr.address.substring(0, 30)}...</option>
                ))}
              </select>
            </div>
          )}

          <label style={{ display: 'block', marginBottom: '10px', color: '#555' }}>Delivery Address</label>
          <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
            <button
              type="button"
              onClick={fetchLocation}
              disabled={locationLoading}
              style={{
                padding: "12px 20px",
                background: locationLoading ? "#ccc" : "#000",
                color: "white",
                border: "none",
                borderRadius: "5px",
                cursor: locationLoading ? "not-allowed" : "pointer",
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              Fetch Current
            </button>
          </div>

          <textarea
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Enter your address here if not fetched automatically..."
            required
            style={{
              width: "100%",
              padding: "12px",
              borderRadius: "5px",
              border: "1px solid #ccc",
              minHeight: "100px",
              resize: "vertical",
              fontSize: "16px"
            }}
          />

          <div style={{ marginTop: '10px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <input
              type="checkbox"
              id="saveAddr"
              checked={saveThisAddress}
              onChange={(e) => setSaveThisAddress(e.target.checked)}
            />
            <label htmlFor="saveAddr" style={{ cursor: 'pointer', color: '#555' }}>Save this address for future</label>

            {saveThisAddress && (
              <input
                type="text"
                placeholder="Label (e.g. Work)"
                value={addressLabel}
                onChange={(e) => setAddressLabel(e.target.value)}
                style={{ padding: '5px', borderRadius: '4px', border: '1px solid #ccc', marginLeft: '10px' }}
              />
            )}
          </div>
        </div>

        {userData && (
          <div style={{ padding: '15px', background: '#f5f5f5', borderRadius: '8px' }}>
            <p><strong>Billed To:</strong> {userData.name}</p>
            <p><strong>Phone:</strong> {userData.phone || "Not provided"}</p>
            <p><strong>Email:</strong> {userData.email}</p>
          </div>
        )}

      </div>
      <div className={style.placeOrderRight}>
        <div className={style1.CartTotal}>
          <h2>Cart Total</h2>
          <div>
            <div className={style1.CartTotalDetails}>
              <p>Subtotal</p>
              <p>₹{getTotalCartAmount()}</p>
            </div>
            <hr />
            <div className={style1.CartTotalDetails}>
              <p>Delivery Fee</p>
              <p>₹{getTotalCartAmount() === 0 ? 0 : 5}</p>
            </div>

            {userPoints > 0 && (
              <>
                <hr />
                <div className={style1.CartTotalDetails}>
                  <label htmlFor='usePoints' style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
                    <input type="checkbox" id='usePoints' checked={usePoints} onChange={(e) => setUsePoints(e.target.checked)} />
                    <b>Restro Wallet</b> (Available: {userPoints} Pts)
                  </label>
                  {usePoints && <p>- ₹{userPoints}</p>}
                </div>
              </>
            )}

            <hr />
            <div className={style1.CartTotalDetails}>
              <b>Total</b>
              <b>₹{getTotalCartAmount() === 0 ? 0 : Math.max(0, getTotalCartAmount() + 5 - (usePoints ? userPoints : 0))}</b>
            </div>
          </div>
          <button type='submit'>Proceed To Payment</button>
        </div>
      </div>
    </form>
  )
}

export default PlaceOrder