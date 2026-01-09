import React, { useEffect, useState } from 'react'
import './list.css'
import axios from 'axios'
import { toast } from 'react-toastify'
import { FiSearch, FiTrash2 } from 'react-icons/fi'

const List = ({ URl }) => {

  const [list, setList] = useState([])
  const [filteredList, setFilteredList] = useState([]);
  const [categories, setCategories] = useState([]);

  // Filters
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectAll, setSelectAll] = useState(false);

  const fetchList = async () => {
    try {
      const response = await axios.get(`${URl}/api/food/list`)
      if (response.data.success) {
        setList(response.data.data);
        setFilteredList(response.data.data);

        // Extract Unique Categories
        const cats = [...new Set(response.data.data.map(item => item.category))];
        setCategories(cats);
      } else {
        toast.error("Error")
      }
    } catch (error) {
      toast.error("Network Error");
    }
  }

  // Filter Logic
  useEffect(() => {
    let result = list;

    if (searchTerm) {
      result = result.filter(item => item.name.toLowerCase().includes(searchTerm.toLowerCase()));
    }

    if (selectedCategory !== "All") {
      result = result.filter(item => item.category === selectedCategory);
    }

    setFilteredList(result);
  }, [list, searchTerm, selectedCategory]);


  // Inline Edit Handler (Mock for now, will connect to update API later)
  const handleEdit = (id, field, value) => {
    // In a real implementation, debounced API call here
    // updateFood(id, field, value);
    console.log(`Update ${id}: ${field} = ${value}`);
  }

  const removeFood = async (foodId) => {
    if (!window.confirm("Are you sure?")) return;

    const response = await axios.post(`${URl}/api/food/remove`, { id: foodId })
    await fetchList();
    if (response.data.success) {
      toast.success(response.data.message)
    } else {
      toast.error("Error")
    }
  }

  useEffect(() => {
    fetchList()
  }, [])

  return (
    <div className='list add flex-col'>
      <div className="list-header">
        <p>Menu Grid</p>
        <div className="search-bar">
          <FiSearch />
          <input
            type="text"
            placeholder="Search items..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="list-filter-bar">
        <select onChange={(e) => setSelectedCategory(e.target.value)} value={selectedCategory}>
          <option value="All">All Categories</option>
          {categories.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        <span className="count-badge">{filteredList.length} Items</span>
      </div>

      <div className="list-table">
        <div className="list-table-format title">
          <b className="check-col">
            <input type="checkbox" checked={selectAll} onChange={() => { setSelectAll(!selectAll) }} />
          </b>
          <b>Name (Editable)</b>
          <b>Category</b>
          <b>Price (Full / Base)</b>
          <b>Variants (Half)</b>
          <b>Action</b>
        </div>
        {filteredList.map((item, index) => {
          // Helper to find variant price
          const halfVariant = item.variants?.find(v => v.name.toLowerCase().includes('half'));
          const halfPrice = halfVariant ? halfVariant.price : "-";

          return (
            <div key={item._id} className='list-table-format'>
              <div className="check-col">
                <input type="checkbox" checked={selectAll} readOnly />
              </div>

              <input
                className="grid-input"
                defaultValue={item.name}
                onBlur={(e) => handleEdit(item._id, 'name', e.target.value)}
              />

              <p>{item.category}</p>

              <input
                className="grid-input price-input"
                defaultValue={item.price}
                type="number"
                onBlur={(e) => handleEdit(item._id, 'price', e.target.value)}
              />

              <p className="variant-text">{halfPrice}</p>

              <p className='cursor delete-btn' onClick={() => removeFood(item._id)}><FiTrash2 /></p>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default List
