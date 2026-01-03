import React, { useContext, useEffect } from "react";
import style from "./cart.module.css";
import { StoreContext } from "../../context/StoreContext";
import { useNavigate } from 'react-router-dom';
import { FaRupeeSign } from "react-icons/fa";
import { ToastContainer, toast } from 'react-toastify';
import { GiCancel } from "react-icons/gi";
const Cart = () => {
  const { cartItem, food_list, removeFromCart, getTotalCartAmount, URl } = useContext(StoreContext);

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

  const checkOut = () => {
    if (getTotalCartAmount() > 0) {
      navigate('/placeorder');
    }
    else {
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
    }
  }

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
          if (cartItem[item._id] > 0) {
            return (
              <div key={item._id}>
                <div
                  className={`${style.CartItemsTitle} ${style.CartItemsItem}`}
                >

                  <p>{item.name}</p>
                  <p><FaRupeeSign />{item.price}</p>
                  <p>{cartItem[item._id]}</p>
                  <p><FaRupeeSign />{item.price * cartItem[item._id]}</p>
                  <p
                    className={style.Cross}
                    onClick={() => removeFromCart(item._id)}
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
