import React, { useEffect, useState } from 'react'
import './MealPlans.css'
import axios from "axios"
import { toast } from 'react-toastify'

const MealPlans = ({ URl }) => {
  const [list, setList] = useState([]);

  const fetchList = async () => {
    try {
      const response = await axios.get(`${URl}/api/mealplan/list`);
      if (response.data.success) {
        setList(response.data.data);
      } else {
        toast.error("Error fetching meal plans");
      }
    } catch (error) {
      toast.error("Error fetching meal plans");
    }
  }

  const removePlan = async (mealPlanId) => {
    try {
      const response = await axios.post(`${URl}/api/mealplan/remove`, { id: mealPlanId });
      if (response.data.success) {
        toast.success(response.data.message);
        fetchList();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error("Error removing plan");
    }
  }

  useEffect(() => {
    fetchList();
  }, [])

  return (
    <div className='list add flex-col'>
      <p>All Meal Plans List</p>
      <div className="list-table">
        <div className="list-table-format title">
          <b>Name</b>
          <b>Type</b>
          <b>Price</b>
          <b>Action</b>
        </div>
        {list.map((item, index) => {
          return (
            <div key={index} className='list-table-format'>
              <p>{item.name}</p>
              <p>{item.planType}</p>
              <p>₹{item.price}</p>
              <p onClick={() => removePlan(item._id)} className='cursor'>X</p>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default MealPlans
