import React, { useState } from 'react'
import style from './explore.module.css'
import { menu_list } from '../../assets/assets'
import Menu from '../../Pages/Menu'
import { FaTh, FaList, FaArrowRight } from 'react-icons/fa'

const ExploreMenu = ({ category, setCategory }) => {
  const [isGridView, setIsGridView] = useState(false)

  return (
    <div className={style.ExploreMenu} id='ExploreMenu'>
      <div className={style.headerControl}>
        <h1>Explore Our Menu</h1>
        <button
          className={style.viewToggle}
          onClick={() => setIsGridView(!isGridView)}
        >
          {isGridView ? <><FaList /> List View</> : <><FaTh /> View All</>}
        </button>
      </div>

      <div className={style.listContainer}>
        <div className={`${style.ExploreMenuList} ${isGridView ? style.mobileGrid : ''}`}>
          {menu_list.map((item, index) => {
            const formatName = (name) => name.charAt(0).toUpperCase() + name.slice(1).replace(/([A-Z])/g, ' $1').trim();
            return (
              <div onClick={() => {
                setCategory(prev => prev === item.menu_name ? "All" : item.menu_name);
                // Wait slightly for state update or just scroll immediately
                setTimeout(() => {
                  const element = document.getElementById("fooddisplay");
                  if (element) {
                    element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }
                }, 100);
              }} key={index} className={style.MenuListItem}>
                <img className={category === item.menu_name ? style.active : ""} src={item.menu_image} alt="" />
                <p>{formatName(item.menu_name)}</p>
              </div>
            )
          })}
        </div>

        {/* Scroll Indicator Arrow - Only show on mobile, list mode */}
        {!isGridView && (
          <div className={`${style.scrollIndicator} mobile-only`}>
            <FaArrowRight />
          </div>
        )}
      </div>
      <hr />
    </div>
  )
}

export default ExploreMenu