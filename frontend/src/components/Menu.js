
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Menu = () => {
  const [menuData, setMenuData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/menu`
        );
        setMenuData(response.data.data || []);
      } catch (error) {
        console.error('Error fetching menu:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMenu();
  }, []);

  if (loading) return <div className="loading-container">Loading menu...</div>;

  return (
    <div className="menu-container">
      <div className="menu-header">
        <h2>Our Menu</h2>
        <p>Delicious dishes made with fresh ingredients</p>
      </div>
      
      {menuData.map((category) => (
        <section key={category.category._id} className="category-section">
          <h3 className="category-title">{category.category.name}</h3>
          <div className="menu-grid">
            {category.items.map((item) => (
              <article key={item._id} className="menu-item">
                <img 
                  src={item.image || '/placeholder-food.jpg'} 
                  alt={item.name}
                  className="menu-item-image"
                />
                <div className="menu-item-content">
                  <div className="menu-item-header">
                    <h4 className="menu-item-name">{item.name}</h4>
                    <span className="menu-item-price">${item.price}</span>
                  </div>
                  <p className="menu-item-description">{item.description}</p>
                  {item.preparationTime && (
                    <span className="menu-item-prep-time">⏱ {item.preparationTime} min</span>
                  )}
                  {!item.isAvailable && (
                    <span className="unavailable-badge">Currently Unavailable</span>
                  )}
                </div>
              </article>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
};

export default Menu;
