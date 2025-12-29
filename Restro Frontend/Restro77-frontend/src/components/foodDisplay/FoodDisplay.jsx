import React, { useContext, useState, useEffect } from "react";
import style from "./fooddisplay.module.css";
import { StoreContext } from "../../context/StoreContext";
import FoodItem from "../FoodItem/FoodItem";
import { FaFilter, FaTimes } from "react-icons/fa";

const FoodDisplay = ({ category }) => {
  const { food_list } = useContext(StoreContext);
  const [searchTerm, setSearchTerm] = useState("");
  const [showFilter, setShowFilter] = useState(false);

  // Advanced Filter States
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [filterType, setFilterType] = useState("all"); // "all", "veg", "nonVeg"

  // Sync with ExploreMenu category prop
  useEffect(() => {
    if (category === "All") {
      setSelectedCategories([]);
    } else {
      setSelectedCategories([category]);
    }
  }, [category]);

  const toggleCategory = (cat) => {
    setSelectedCategories((prev) =>
      prev.includes(cat)
        ? prev.filter((c) => c !== cat)
        : [...prev, cat]
    );
  };

  // Get all unique categories for the filter list
  const allCategories = [...new Set(food_list.map(item => item.category))];

  // Deep Search Logic
  const filteredFood = food_list.filter((item) => {
    // 1. Search Term
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());

    // 2. Category Filter (empty means All)
    const matchesCategory = selectedCategories.length === 0 || selectedCategories.includes(item.category);

    // 3. Type Filter
    const matchesType = filterType === "all" || item.type === filterType;

    return matchesSearch && matchesCategory && matchesType;
  });

  // Get unique categories of the RESULT for section rendering
  const resultCategories = [
    ...new Set(filteredFood.map((item) => item.category)),
  ];

  const formatCategory = (cat) => {
    return cat.charAt(0).toUpperCase() + cat.slice(1).replace(/([A-Z])/g, ' $1').trim();
  };

  return (
    <div className={style.FoodDisplay} id="fooddisplay">
      <div className={style.searchWrapper}>
        <div className={style.searchContainer}>
          <input
            type="text"
            id="search-input"
            placeholder="Search for food..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={style.searchInput}
          />
          <button
            className={`${style.filterBtn} ${showFilter || selectedCategories.length > 0 || filterType !== "all" ? style.activeFilter : ""}`}
            onClick={() => setShowFilter(!showFilter)}
          >
            <FaFilter />
          </button>
        </div>

        {/* Filter Dropdown */}
        {showFilter && (
          <div className={style.filterDropdown}>
            <div className={style.filterHeader}>
              <h3>Filters</h3>
              <button onClick={() => setShowFilter(false)}><FaTimes /></button>
            </div>

            <div className={style.filterSection}>
              <h4>Type</h4>
              <div className={style.typeOptions}>
                <button
                  className={filterType === "all" ? style.selectedType : ""}
                  onClick={() => setFilterType("all")}
                >All</button>
                <button
                  className={filterType === "veg" ? style.selectedType : ""}
                  onClick={() => setFilterType("veg")}
                >Veg</button>
                <button
                  className={filterType === "nonVeg" ? style.selectedType : ""}
                  onClick={() => setFilterType("nonVeg")}
                >Non-Veg</button>
              </div>
            </div>

            <div className={style.filterSection}>
              <h4>Categories</h4>
              <div className={style.categoryGrid}>
                {allCategories.map((cat) => (
                  <label key={cat} className={style.checkboxLabel}>
                    <input
                      type="checkbox"
                      checked={selectedCategories.includes(cat)}
                      onChange={() => toggleCategory(cat)}
                    />
                    {formatCategory(cat)}
                  </label>
                ))}
              </div>
            </div>

            <div className={style.filterFooter}>
              <button className={style.clearBtn} onClick={() => {
                setSelectedCategories([]);
                setFilterType("all");
              }}>Clear Filters</button>
            </div>
          </div>
        )}
      </div>

      <div className={style.FoodDisplayList}>
        {resultCategories.map((catString, index) => (
          <section key={index}>
            <h2 className={style.sectionTitle}>{formatCategory(catString)}</h2>
            <div className={style.menuGrid}>
              {filteredFood
                .filter((item) => item.category === catString)
                .map((item) => (
                  <FoodItem key={item._id} item={item} />
                ))}
            </div>
          </section>
        ))}
        {resultCategories.length === 0 && (
          <p className={style.noResults}>No food found matching your criteria.</p>
        )}
      </div>
    </div>
  );
};

export default FoodDisplay;
