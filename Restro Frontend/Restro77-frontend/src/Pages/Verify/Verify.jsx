import React, { useContext, useEffect } from 'react'
import styles from './verify.module.css'
import { useNavigate, useSearchParams } from 'react-router-dom';
import { StoreContext } from '../../context/StoreContext'
import axios from 'axios';

const Verify = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const success = searchParams.get("success")
  const orderId = searchParams.get("orderId")
  const { URl } = useContext(StoreContext)
  const navigate = useNavigate()

  const verifyPayment = async () => {
    const response = await axios.post(URl + "/api/order/verify", { success, orderId })
    if (response.data.success) {
      navigate("/myorders", { state: { pointsEarned: response.data.pointsEarned } })
    } else {
      navigate("/")
    }
  }

  useEffect(() => {
    verifyPayment()
  }, [])

  return (
    <div className={styles.verify}>
      <div className={styles.spinner}></div>
    </div>
  )
}

export default Verify
