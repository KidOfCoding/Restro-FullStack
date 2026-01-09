import React, { useContext, useState, useEffect } from "react";
import style from "./fooddisplay.module.css";
import { StoreContext } from "../../context/StoreContext";
import FoodItem from "../FoodItem/FoodItem";
import { FaFilter, FaTimes } from "react-icons/fa";

const FoodDisplay = ({ category }) => {
  const { food_list } = useContext(StoreContext);
  const [searchTerm, setSearchTerm] = useState("");
  const [showFilter, setShowFilter] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  // Advanced Filter States
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [filterType, setFilterType] = useState("all"); // "all", "veg", "non-veg"

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

  // Toggle Handler: All -> Veg -> Non-Veg -> All
  // Logic: If on Neutral (All), go to Veg. If on Veg, go to Non-Veg. If on Non-Veg, go to Neutral.
  const handleToggle = () => {
    if (filterType === "all") setFilterType("veg");
    else if (filterType === "veg") setFilterType("non-veg");
    else setFilterType("all");
  };

  // Get all unique categories for the filter list
  const allCategories = [...new Set(food_list.map(item => item.category))];

  // Deep Search Logic (With Type)
  const filteredFood = food_list.filter((item) => {
    // 1. Search Term
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());

    // 2. Category Filter (empty means All)
    const matchesCategory = selectedCategories.length === 0 || selectedCategories.some(cat => item.category.toLowerCase() === cat.toLowerCase());

    // 3. Type Filter
    let matchesType = true;
    if (filterType === "veg") matchesType = item.type === "veg";
    if (filterType === "non-veg") matchesType = (item.type === "non-veg" || item.type === "nonVeg");

    return matchesSearch && matchesCategory && matchesType;
  });

  // STABLE LAYOUT LOGIC:
  // Get items matching Search + Category Select (ignoring Type)
  // This ensures sections don't disappear just because the toggle is switched.
  const baseFilteredFood = food_list.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategories.length === 0 || selectedCategories.some(cat => item.category.toLowerCase() === cat.toLowerCase());
    return matchesSearch && matchesCategory;
  });

  // Get unique categories for section rendering (based on STABLE base list)
  const resultCategories = [
    ...new Set(baseFilteredFood.map((item) => {
      let cat = item.category || "";
      // Normalize: Title Case + Trim
      cat = cat.trim().charAt(0).toUpperCase() + cat.trim().slice(1).toLowerCase();

      // Manual Fixes for Singular/Plural
      if (cat === "Starter") cat = "Starters";
      if (cat === "Roll") cat = "Rolls";
      if (cat === "Noodle") cat = "Noodles";

      return cat;
    })),
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
            onFocus={() => setIsSearchFocused(true)}
            onBlur={() => {
              setTimeout(() => setIsSearchFocused(false), 200);
            }}
            className={style.searchInput}
          />

          {(searchTerm.length > 0 || isSearchFocused) && !showFilter && selectedCategories.length === 0 && filterType === "all" && (
            <div className={style.searchHint}>
              Apply Filters
            </div>
          )}

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
                  className={filterType === "non-veg" ? style.selectedType : ""}
                  onClick={() => setFilterType("non-veg")}
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
        {resultCategories.map((catString, index) => {
          return (
            <section key={index}>
              <div className={style.sectionHeader}>
                <h2 className={style.sectionTitle}>{formatCategory(catString)}</h2>

                {/* Segmented Toggle Control (User Snippet) */}
                <div className={style.foodToggleContainer}>
                  <div
                    className={style.toggleSlider}
                    style={{
                      left: filterType === "veg" ? "2px" : filterType === "all" ? "calc(33.333% + 0.6px)" : "calc(66.666% - 0.6px)",
                      backgroundColor: filterType === "veg" ? "#2ecc71" : filterType === "all" ? "#95a5a6" : "#e74c3c"
                    }}
                    onClick={handleToggle}
                  ></div>

                  <button
                    className={`${style.toggleBtn} ${filterType === "veg" ? style.activeBtn : ""}`}
                    onClick={() => setFilterType("veg")}
                  >
                    <span>🌱</span> <span className={style.toggleLabel}>Veg</span>
                  </button>

                  <button
                    className={`${style.toggleBtn} ${filterType === "all" ? style.activeBtn : ""}`}
                    onClick={() => setFilterType("all")}
                  >
                    <span>⚪</span> <span className={style.toggleLabel}>Neutral</span>
                  </button>

                  <button
                    className={`${style.toggleBtn} ${filterType === "non-veg" ? style.activeBtn : ""}`}
                    onClick={() => setFilterType("non-veg")}
                  >
                    <span>🍗</span> <span className={style.toggleLabel}>Non-Veg</span>
                  </button>
                </div>
              </div>

              <div className={style.menuGrid}>
                {baseFilteredFood
                  .filter((item) => {
                    let itemCat = (item.category || "").trim().charAt(0).toUpperCase() + (item.category || "").trim().slice(1).toLowerCase();
                    if (itemCat === "Starter") itemCat = "Starters";
                    if (itemCat === "Roll") itemCat = "Rolls";
                    if (itemCat === "Noodle") itemCat = "Noodles";

                    if (itemCat !== catString) return false;

                    // Filter Logic
                    if (filterType === "all") return true;
                    if (filterType === "veg" && item.type === "veg") return true;
                    if (filterType === "non-veg" && (item.type === "non-veg" || item.type === "nonVeg")) return true;

                    return false;
                  })
                  .map((item) => (
                    <FoodItem key={item._id} item={item} />
                  ))}
              </div>
            </section>
          )
        })}
        {filteredFood.length === 0 && (
          <p className={style.noResults}>No food found matching your criteria.</p>
        )}
      </div>
    </div>
  );
};

export default FoodDisplay;
