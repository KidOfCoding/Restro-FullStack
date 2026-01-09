import React, { useContext, useState } from 'react'
import style from './fooditem.module.css'
import { assets } from '../../assets/assets'
import { StoreContext } from '../../context/StoreContext'
import { TbShoppingCartPlus } from "react-icons/tb";
import { TbShoppingCartOff } from "react-icons/tb";
const FoodItem = ({ item }) => {

  const { cartItem, addToCart, removeFromCart, URl } = useContext(StoreContext)

  // Check if item has variants
  const hasVariants = item.variants && item.variants.length > 0;

  // Variant State - Default to "Half" if exists, else "Full" (or first available)
  const [variant, setVariant] = useState(() => {
    if (hasVariants) {
      const hasHalf = item.variants.some(v => v.name.toLowerCase() === "half");
      return hasHalf ? "Half" : "Full";
    }
    return "Full";
  });

  // Get Current Price based on selection
  const currentPrice = hasVariants
    ? (item.variants.find(v => v.name === variant)?.price || item.price)
    : item.price;

  // Cart Key logic:
  // If has variants, key is "id-VariantName" (e.g. "123-Half")
  // If no variants, key is "id"
  const getItemKey = () => hasVariants ? `${item._id}-${variant}` : item._id;

  const currentKey = getItemKey();
  const currentQty = cartItem[currentKey] || 0;

  return (
    <div className="item-card">
      <div className="item-info">
        <div className={`symbol ${item?.type}`}>
          <div className={`dot ${item?.type}`}></div>
        </div>
        <div className="flex-col">
          <span className="item-name">{item?.name}</span>
          {hasVariants && (
            <div className={style.variantSelector}>
              <span
                className={variant === "Half" ? style.activeVariant : ""}
                onClick={() => setVariant("Half")}
              >
                Half
              </span>
              <span
                className={variant === "Full" ? style.activeVariant : ""}
                onClick={() => setVariant("Full")}
              >
                Full
              </span>
            </div>
          )}
        </div>
      </div>

      <div className={style.pricecard}>
        <span className="price">₹{currentPrice}</span>

        {/* NOT IN CART */}
        {currentQty === 0 ? (
          <TbShoppingCartPlus
            className={style.addcart}
            size={25}
            color="orange"
            onClick={() => addToCart(item?._id, hasVariants ? variant : null)}
          />
        ) : (
          /* IN CART → SHOW +/- */
          <div className={style.qtyControl}>
            <button
              className={style.qtyBtn}
              onClick={() => removeFromCart(item?._id, hasVariants ? variant : null)}
            >
              −
            </button>

            <span className={style.qty}>{currentQty}</span>

            <button
              className={style.qtyBtn}
              onClick={() => addToCart(item?._id, hasVariants ? variant : null)}
            >
              +
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default FoodItem