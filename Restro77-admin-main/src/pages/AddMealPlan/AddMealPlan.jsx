import React, { useState } from 'react'
import './AddMealPlan.css'
import axios from "axios"
import { toast } from 'react-toastify'

const AddMealPlan = ({ URl }) => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({
    name: "",
    price: "",
    planType: "Weekly",
    description: "",
    features: "",
    image: ""
  })

  const onChangeHandler = (event) => {
    const { name, value } = event.target;
    setData(prev => ({ ...prev, [name]: value }))
  }

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    setLoading(true);

    const planData = {
      name: data.name,
      price: Number(data.price),
      planType: data.planType,
      description: data.description,
      features: data.features,
      image: data.image
    }

    try {
      const response = await axios.post(`${URl}/api/mealplan/add`, planData);
      if (response.data.success) {
        setData({
          name: "",
          price: "",
          planType: "Weekly",
          description: "",
          features: "",
          image: ""
        })
        toast.success(response.data.message)
      } else {
        toast.error(response.data.message)
      }
    } catch (error) {
      toast.error("Error adding meal plan");
      console.error(error);
    }
    setLoading(false);
  }

  return (
    <div className='add-meal-plan'>
      <div className="add-card">
        <h2>Add New Meal Plan</h2>
        <form className='flex-col' onSubmit={onSubmitHandler}>

          <div className="add-product-name flex-col">
            <p>Plan Name</p>
            <input className="add-input" onChange={onChangeHandler} value={data.name} type="text" name="name" placeholder='e.g., Weekly Premium Veg' required />
          </div>

          <div className="add-product-name flex-col">
            <p>Description</p>
            <textarea className="add-input" onChange={onChangeHandler} value={data.description} name="description" placeholder='Short description of the plan' rows={3}></textarea>
          </div>
          
          <div className="add-product-name flex-col">
            <p>Features (comma separated)</p>
            <input className="add-input" onChange={onChangeHandler} value={data.features} type="text" name="features" placeholder='2 Meals/Day, Free Delivery, Veg Only' />
          </div>
          
          <div className="add-product-name flex-col">
            <p>Image URL (Optional)</p>
            <input className="add-input" onChange={onChangeHandler} value={data.image} type="text" name="image" placeholder='http://example.com/image.jpg' />
          </div>

          <div className="add-category-price">
            <div className="add-category flex-col">
              <p>Plan Type</p>
              <select className="add-input" onChange={onChangeHandler} name='planType' value={data.planType}>
                <option value="Weekly">Weekly</option>
                <option value="Monthly">Monthly</option>
              </select>
            </div>

            <div className="add-price flex-col">
              <p>Plan Price</p>
              <input className="add-input" onChange={onChangeHandler} value={data.price} type="number" name="price" placeholder='₹1000' required />
            </div>
          </div>

          <button type='submit' className='add-btn' disabled={loading}>
            {loading ? "Adding..." : "Add Plan"}
          </button>
        </form>
      </div>
    </div>
  )
}

export default AddMealPlan
