import React, { useState } from 'react'
import style from './home.module.css'
import Header from '../../components/Header/Header'
import ExploreMenu from '../../components/ExploreMenu/ExploreMenu'
import FoodDisplay from '../../components/foodDisplay/FoodDisplay'
import Testimonials from '../../components/Testimonials/Testimonials'

const Home = () => {

  const [category, setCategory] = useState("All")


  return (
    <div className={style.a1}>
      <Header />
      <ExploreMenu category={category} setCategory={setCategory} />
      <FoodDisplay category={category} />
      <Testimonials />
    </div>
  );
}

export default Home