import React, { useContext, useState } from 'react'
import style from './fooditem.module.css'
import { assets } from '../../assets/assets'
import { StoreContext } from '../../context/StoreContext'
import { TbShoppingCartPlus } from "react-icons/tb";
import { TbShoppingCartOff } from "react-icons/tb";
const FoodItem = ({item}) => {

    const {cartItem,addToCart,removeFromCart,URl} = useContext(StoreContext)
 //  console.log(item);
   

  return (
    <div 
    //className={style.FoodItem}
     >
        {/* <div className={style.FoodItemImageContainer}>
            <img className={style.FoodItemImage} src={URl+"/images/"+image} alt="" />
            {
                !cartItem[id]
                ?<img className={style.add} onClick={()=>addToCart(id)} src={assets.add_icon_white} alt="" />
                :<div className={style.FoodItemCount}>
                    <img src={assets.remove_icon_red} onClick={()=>removeFromCart(id)}  alt="" />
                    <p>{cartItem[id]}</p>
                    <img src={assets.add_icon_green} onClick={()=>addToCart(id)}  alt="" />
                </div>
            }
        </div>
        <div className={style.FoodItemInfo}>
            <div className={style.FoodItemName}> 
                <p>{name}</p>
                <img src={assets.rating_starts} alt="" />
            </div>
            <p className={style.FoodItemDescription}>
                {description}
            </p>
            <p className={style.FoodItemPrice}>${price}</p>
        </div> */}
       <div className="item-card">
  <div className="item-info">
    <div className={`symbol ${item?.type}`}>
      <div className={`dot ${item?.type}`}></div>
    </div>
    <span className="item-name">{item?.name}</span>
  </div>

  <div className={style.pricecard}>
    <span className="price">₹{item?.price}</span>

    {/* NOT IN CART */}
    {!cartItem[item?._id] ? (
      <TbShoppingCartPlus
        className={style.addcart}
        size={25}
        color="orange"
        onClick={() => addToCart(item?._id)}
      />
    ) : (
      /* IN CART → SHOW +/- */
      <div className={style.qtyControl}>
        <button
          className={style.qtyBtn}
          onClick={() => removeFromCart(item?._id)}
        >
          −
        </button>

        <span className={style.qty}>{cartItem[item?._id]}</span>

        <button
          className={style.qtyBtn}
          onClick={() => addToCart(item?._id)}
        >
          +
        </button>
      </div>
    )}
  </div>
</div>
</div>
  )
}

export default FoodItem