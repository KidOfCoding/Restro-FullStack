import React, { useState } from 'react';
import './App1.css';

const menuData = {
  "Noodles": { 
    "veg": [ { "name": "Veg Noodles", "price": 50 }, { "name": "Schezwan Veg Noodles", "price": 60 }, { "name": "Veg Hakka Noodles", "price": 70 }, { "name": "Mix Veg Noodles", "price": 70 }, { "name": "Paneer Noodles", "price": 60 }, { "name": "Mushroom Noodles", "price": 60 }, { "name": "American Veg Noodles", "price": 75 } ], 
    "nonVeg": [ { "name": "American Non-Veg Noodles", "price": 100 }, { "name": "Chicken Noodles", "price": 70 }, { "name": "Schezwan Chicken Noodles", "price": 80 }, { "name": "Egg Noodles", "price": 60 } ] 
  },
  "Rice": { 
    "veg": [ { "name": "Veg Fried Rice", "price": 50 }, { "name": "Schezwan Veg Fried Rice", "price": 60 }, { "name": "Paneer Fried Rice", "price": 60 }, { "name": "Kaju Fried Rice", "price": 60 }, { "name": "Plain Rice", "price": 40 } ], 
    "nonVeg": [ { "name": "Chicken Fried Rice", "price": 65 }, { "name": "Egg Fried Rice", "price": 60 } ] 
  },
  "Starters": { 
    "veg": [ { "name": "Gobi Chilli", "price": 80 }, { "name": "Paneer Chilli", "price": 100 }, { "name": "Veg Manchurian", "price": 80 } ], 
    "nonVeg": [ { "name": "Chilli Chicken", "price": 120 }, { "name": "Chicken 65", "price": 120 }, { "name": "Chicken Lollipop", "price": 140 } ] 
  },
  "Main Course": { 
    "veg": [ { "name": "Paneer Butter Masala", "price": 200 }, { "name": "Mushroom Masala", "price": 180 } ], 
    "nonVeg": [ { "name": "Chicken Kasa", "price": 200 }, { "name": "Chicken Butter Masala", "price": 240 } ] 
  },
  "Special Combos": [ 
    { "name": "Paneer Chilli + 2 Parathas", "price": 80 }, 
    { "name": "Chicken Chilli + 2 Parathas", "price": 100 } 
  ]
};


function Menu() {
  const [activeTab, setActiveTab] = useState("");

  const checkNonVeg = (name) => {
    return name.toLowerCase().includes('chicken') || name.toLowerCase().includes('egg');
  };

  return (
    <div className="App">
      <header>
        <h1>Flavors of India</h1>
        <div className="category-tabs">
          {Object.keys(menuData).map((category) => (
            <a 
              key={category}
              href={`#${category.replace(/\s+/g, '')}`} 
              className={`tab ${activeTab === category ? 'active' : ''}`}
              onClick={() => setActiveTab(category)}
            >
              {category}
            </a>
          ))}
        </div>
      </header>

      <main className="container">
        {Object.entries(menuData).map(([category, items]) => (
          <section key={category} id={category.replace(/\s+/g, '')}>
            <h2 className="section-title">{category}</h2>
            <div className="menu-grid">
              {Array.isArray(items) ? (
                // Handle flat arrays (Special Combos)
                items.map((item, idx) => (
                  <MenuCard key={idx} item={item} isNonVeg={checkNonVeg(item.name)} />
                ))
              ) : (
                // Handle nested veg/nonVeg objects
                <>
                  {items.veg?.map((item, idx) => (
                    <MenuCard key={`veg-${idx}`} item={item} isNonVeg={false} />
                  ))}
                  {items.nonVeg?.map((item, idx) => (
                    <MenuCard key={`nv-${idx}`} item={item} isNonVeg={true} />
                  ))}
                </>
              )}
            </div>
          </section>
        ))}
      </main>
    </div>
  );
}

export default Menu;