import React, { useEffect, useState } from 'react'
import './add.css'
import { assets } from '../../assets/assets'
import axios from "axios"
import { toast } from 'react-toastify'

const Add = ({ URl }) => {

  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({
    name: "",
    price: "",
    category: "noodles", // Default to first valid category
    type: "veg"
  })

  const onChangeHandler = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setData(data => ({ ...data, [name]: value }))
  }

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    setLoading(true);

    // Using JSON as we are not uploading images anymore
    const foodData = {
      name: data.name,
      price: Number(data.price),
      category: data.category,
      type: data.type
    }

    try {
      const response = await axios.post(`${URl}/api/food/add`, foodData);
      if (response.data.success) {
        setData({
          name: "",
          price: "",
          category: "noodles",
          type: "veg"
        })
        toast.success(response.data.message)
      } else {
        toast.error(response.data.message)
      }
    } catch (error) {
      toast.error("Error adding food");
      console.error(error);
    }
    setLoading(false);
  }

  return (
    <div className='add'>
      <div className="add-card">
        <h2>add new iteam</h2>
        <form className='flex-col' onSubmit={onSubmitHandler}>

          <div className="add-product-name flex-col">
            <p>Product Name</p>
            <input className="add-input" onChange={onChangeHandler} value={data.name} type="text" name="name" placeholder='Type here' required />
          </div>

          <div className="add-category-price">
            <div className="add-category flex-col">
              <p>Product Category</p>
              <select className="add-input" onChange={onChangeHandler} name='category' value={data.category}>
                <option value="noodles">Noodles</option>
                <option value="rice">Rice</option>
                <option value="rolls">Rolls</option>
                <option value="starter">Starter</option>
                <option value="mainCourse">Main Course</option>
                <option value="breads">Breads</option>
                <option value="pasta">Pasta</option>
                <option value="combo">Combo</option>
              </select>
            </div>

            <div className="add-category flex-col">
              <p>Type</p>
              <select className="add-input" onChange={onChangeHandler} name='type' value={data.type}>
                <option value="veg">Veg</option>
                <option value="nonVeg">Non-Veg</option>
              </select>
            </div>

            <div className="add-price flex-col">
              <p>Product Price</p>
              <input className="add-input" onChange={onChangeHandler} value={data.price} type="number" name="price" placeholder='₹20' required />
            </div>
          </div>

          <button type='submit' className='add-btn' disabled={loading}>
            {loading ? "Adding..." : "Add Item"}
          </button>
        </form>
      </div>
    </div>
  )
}

export default Add
