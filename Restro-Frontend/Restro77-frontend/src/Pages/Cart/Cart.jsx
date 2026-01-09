import React, { useContext, useEffect } from "react";
import style from "./cart.module.css";
import { StoreContext } from "../../context/StoreContext";
import { useNavigate } from 'react-router-dom';
import { FaRupeeSign } from "react-icons/fa";
import { ToastContainer, toast } from 'react-toastify';
import { GiCancel } from "react-icons/gi";
import { useState } from 'react';

const Cart = ({ setShowLogin }) => {
  const { cartItem, food_list, removeFromCart, getTotalCartAmount, URl, token } = useContext(StoreContext);

  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Redirect to home if cart becomes empty
  useEffect(() => {
    // Only redirect if food_list has loaded (avoid premature redirect) AND cart is legally empty
    if (food_list.length > 0 && getTotalCartAmount() === 0) {
      navigate('/');
    }
  }, [cartItem, getTotalCartAmount, navigate, food_list]);

  const [pendingCheckout, setPendingCheckout] = useState(false);

  const checkOut = () => {
    if (getTotalCartAmount() === 0) {
      toast.warn('There is no item', {
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

    if (!token) {
      setPendingCheckout(true);
      setShowLogin(true);
      return;
    }

    navigate('/placeorder');
  }

  // Auto-Redirect to PlaceOrder if token appears while pendingCheckout
  useEffect(() => {
    if (token && pendingCheckout) {
      setPendingCheckout(false); // Reset
      navigate('/placeorder');
    }
  }, [token, pendingCheckout, navigate]);

  return (
    <div className={style.Cart}>
      <div className={style.CartItems}>
        <div className={style.CartItemsTitle}>

          <p>Title</p>
          <p>Price</p>
          <p>Quantity</p>
          <p>Total</p>
          <p>Remove</p>
        </div>
        <br />
        <hr />
        {food_list.map((item, index) => {
          // We need to iterate over cart keys, not just food_list, 
          // because one food item (Paneer Masala) can appear twice (Half & Full)
          return null;
        })}
        {/* Iterate over Cart Items directly */}
        {Object.keys(cartItem).map((key) => {
          if (cartItem[key] > 0) {
            const [itemId, variantName] = key.split('-');
            const item = food_list.find(f => f._id === itemId);

            if (!item) return null;

            let price = item.price;
            let displayName = item.name;

            if (variantName) {
              displayName += ` (${variantName})`;
              const v = item.variants?.find(v => v.name === variantName);
              if (v) price = v.price;
            }

            return (
              <div key={key}>
                <div className={`${style.CartItemsTitle} ${style.CartItemsItem}`}>
                  <p>{displayName}</p>
                  <p><FaRupeeSign />{price}</p>
                  <p>{cartItem[key]}</p>
                  <p><FaRupeeSign />{price * cartItem[key]}</p>
                  <p
                    className={style.Cross}
                    onClick={() => removeFromCart(itemId, variantName)}
                  >
                    <GiCancel color="red" />
                  </p>
                </div>
                <hr />
              </div>
            );
          }
        })}
      </div>
      <div className={style.CartBottom}>
        <div className={style.CartTotal}>
          <h2>Cart Total</h2>
          <div>
            <div className={style.CartTotalDetails}>
              <p>Subtotal</p>
              <p><FaRupeeSign />{getTotalCartAmount()}</p>
            </div>
            <hr />
            <div className={style.CartTotalDetails}>
              <p>Delivery Fee</p>
              <p><FaRupeeSign />{getTotalCartAmount() === 0 ? 0 : Number(import.meta.env.VITE_DELIVERY_FEE || 0)}</p>
            </div>
            <hr />
            <div className={style.CartTotalDetails}>
              <b>Total</b>
              <b><FaRupeeSign />{getTotalCartAmount() === 0 ? 0 : getTotalCartAmount() + Number(import.meta.env.VITE_DELIVERY_FEE || 0)}</b>
            </div>
          </div>
          <button onClick={checkOut}>Checkout</button>
        </div>
        <div className={style.CartPromoCode}>
          <div>
            <p>If you have promo code then add here</p>
            <div className={style.CartPromoCodeInput}>
              <input type="text" placeholder="Promocode" />
              <button>Submit</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart
