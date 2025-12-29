import React, { useContext } from 'react'
import style from './floatingcart.module.css'
import { StoreContext } from '../../context/StoreContext'
import { Link } from 'react-router-dom'

const FloatingCart = () => {
    const { cartItem, getTotalCartAmount } = useContext(StoreContext);

    const totalItems = Object.values(cartItem).reduce((acc, curr) => acc + curr, 0);
    const totalAmount = getTotalCartAmount();

    if (totalItems === 0) return null;

    return (
        <div className={style.floatingCart}>
            <div className={style.cartInfo}>
                <span className={style.itemCount}>{totalItems} Items</span>
                <span className={style.separator}>|</span>
                <span className={style.totalPrice}>₹{totalAmount}</span>
            </div>
            <Link to='/cart' className={style.viewCartBtn}>
                View Cart
            </Link>
        </div>
    )
}

export default FloatingCart
