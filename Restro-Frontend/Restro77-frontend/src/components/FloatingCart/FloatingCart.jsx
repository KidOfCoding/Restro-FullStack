import React, { useContext } from 'react'
import style from './floatingcart.module.css'
import { StoreContext } from '../../context/StoreContext'
import { Link } from 'react-router-dom'
import { FaTrash } from "react-icons/fa";

const FloatingCart = () => {
    const { cartItem, getTotalCartAmount, clearCart } = useContext(StoreContext);

    const totalItems = Object.values(cartItem).reduce((acc, curr) => acc + curr, 0);
    const totalAmount = getTotalCartAmount();

    if (totalItems === 0) return null;

    const handleClearCart = (e) => {
        e.preventDefault(); // Prevent Link navigation if wrapped or close
        e.stopPropagation();
        if (window.confirm("Are you sure you want to clear your cart?")) {
            clearCart();
        }
    }

    return (
        <div className={style.floatingCart}>
            <div className={style.cartInfo}>
                <span className={style.itemCount}>{totalItems} Items</span>
                <span className={style.separator}>|</span>
                <span className={style.totalPrice}>₹{totalAmount}</span>
            </div>
            <div className={style.actions}>
                <Link to='/cart' className={style.viewCartBtn}>
                    View Cart
                </Link>
                <FaTrash className={style.deleteIcon} onClick={handleClearCart} />
            </div>
        </div>
    )
}

export default FloatingCart
