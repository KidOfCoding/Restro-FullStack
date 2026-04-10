import React, { useState } from 'react'
import style from './home.module.css'
import Header from '../../components/Header/Header'
import ExploreMenu from '../../components/ExploreMenu/ExploreMenu'
import FoodDisplay from '../../components/foodDisplay/FoodDisplay'
import Testimonials from '../../components/Testimonials/Testimonials'
import SpecialOfferTag from '../../components/SpecialOfferTag/SpecialOfferTag'
import SubscriptionPromoBanner from '../../components/SubscriptionPromoBanner/SubscriptionPromoBanner'

const Home = ({ setShowOfferModal, showOfferModal }) => {

  const [category, setCategory] = useState("All")


  return (
    <div className={style.a1} style={{ position: 'relative' }}>
      <SpecialOfferTag
        onClick={() => setShowOfferModal(true)}
        show={!showOfferModal}
      />
      <Header />
      <SubscriptionPromoBanner />
      <ExploreMenu category={category} setCategory={setCategory} />
      <FoodDisplay category={category} />
      <Testimonials />
    </div>
  );
}

export default Home