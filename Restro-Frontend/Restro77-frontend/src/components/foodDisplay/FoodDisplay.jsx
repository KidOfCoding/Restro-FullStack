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
  const [defaultFilter, setDefaultFilter] = useState("all"); // Global fallback
  const [sectionFilters, setSectionFilters] = useState({}); // Per-category overrides

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

  // Helper to get effective filter for a category
  const getFilterForCategory = (cat) => {
    return sectionFilters[cat] || defaultFilter;
  };

  // Toggle Handler for a specific category
  const handleSectionToggle = (cat) => {
    const current = getFilterForCategory(cat);
    let next = "all";
    if (current === "all") next = "veg";
    else if (current === "veg") next = "non-veg";
    else next = "all";

    setSectionFilters(prev => ({ ...prev, [cat]: next }));
  };

  // Global Filter Handlers
  const setGlobalFilter = (type) => {
    setDefaultFilter(type);
    setSectionFilters({}); // Reset local overrides to enforce global
  };


  // Get all unique categories for the filter list
  const allCategories = [...new Set(food_list.map(item => item.category))];

  // Deep Search Logic (With Type - purely for "No Result" check if needed, but tricky with mixed filters)
  // Actually, for the "No food found" text, we need to know if ANY section has items.
  // We'll calculate emptiness during render.

  // STABLE LAYOUT LOGIC:
  // Get items matching Search + Category Select (ignoring Type)
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

  // Calculate if we have any items visible across all sections
  const hasVisibleItems = resultCategories.some(catString => {
    const filter = getFilterForCategory(catString);
    return baseFilteredFood.some(item => {
      let itemCat = (item.category || "").trim().charAt(0).toUpperCase() + (item.category || "").trim().slice(1).toLowerCase();
      if (itemCat === "Starter") itemCat = "Starters";
      if (itemCat === "Roll") itemCat = "Rolls";
      if (itemCat === "Noodle") itemCat = "Noodles";
      if (itemCat !== catString) return false;

      if (filter === "all") return true;
      if (filter === "veg" && item.type === "veg") return true;
      if (filter === "non-veg" && (item.type === "non-veg" || item.type === "nonVeg")) return true;
      return false;
    });
  });

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

          {(searchTerm.length > 0 || isSearchFocused) && !showFilter && selectedCategories.length === 0 && defaultFilter === "all" && (
            <div className={style.searchHint}>
              Apply Filters
            </div>
          )}

          <button
            className={`${style.filterBtn} ${showFilter || selectedCategories.length > 0 || defaultFilter !== "all" ? style.activeFilter : ""}`}
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
                  className={defaultFilter === "all" ? style.selectedType : ""}
                  onClick={() => setGlobalFilter("all")}
                >All</button>
                <button
                  className={defaultFilter === "veg" ? style.selectedType : ""}
                  onClick={() => setGlobalFilter("veg")}
                >Veg</button>
                <button
                  className={defaultFilter === "non-veg" ? style.selectedType : ""}
                  onClick={() => setGlobalFilter("non-veg")}
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
                setGlobalFilter("all");
              }}>Clear Filters</button>
            </div>
          </div>
        )}
      </div>

      <div className={style.FoodDisplayList}>
        {resultCategories.map((catString, index) => {
          const currentSectionFilter = getFilterForCategory(catString);

          return (
            <section key={index}>
              <div className={style.sectionHeader}>
                <h2 className={style.sectionTitle}>{formatCategory(catString)}</h2>

                {/* Segmented Toggle Control (User Snippet) */}
                <div className={style.foodToggleContainer}>
                  <div
                    className={style.toggleSlider}
                    style={{
                      left: currentSectionFilter === "veg" ? "2px" : currentSectionFilter === "all" ? "calc(33.333% + 0.6px)" : "calc(66.666% - 0.6px)",
                      backgroundColor: currentSectionFilter === "veg" ? "#2ecc71" : currentSectionFilter === "all" ? "#95a5a6" : "#e74c3c"
                    }}
                    onClick={() => handleSectionToggle(catString)}
                  ></div>

                  <button
                    className={`${style.toggleBtn} ${currentSectionFilter === "veg" ? style.activeBtn : ""}`}
                    onClick={() => setSectionFilters(prev => ({ ...prev, [catString]: "veg" }))}
                  >
                    <span>🌱</span> <span className={style.toggleLabel}>Veg</span>
                  </button>

                  <button
                    className={`${style.toggleBtn} ${currentSectionFilter === "all" ? style.activeBtn : ""}`}
                    onClick={() => setSectionFilters(prev => ({ ...prev, [catString]: "all" }))}
                  >
                    <span>⚪</span> <span className={style.toggleLabel}>Neutral</span>
                  </button>

                  <button
                    className={`${style.toggleBtn} ${currentSectionFilter === "non-veg" ? style.activeBtn : ""}`}
                    onClick={() => setSectionFilters(prev => ({ ...prev, [catString]: "non-veg" }))}
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

                    // Filter Logic using LOCAL section filter
                    if (currentSectionFilter === "all") return true;
                    if (currentSectionFilter === "veg" && item.type === "veg") return true;
                    if (currentSectionFilter === "non-veg" && (item.type === "non-veg" || item.type === "nonVeg")) return true;

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
