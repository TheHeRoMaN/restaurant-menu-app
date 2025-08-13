
import React from 'react';
const Menu = ({ categories = [] }) => (
  <div className="menu-container">
    {categories.map(cat => (
      <section key={cat._id || cat.name} className="category-section">
        <h2 className="category-title">{cat.name}</h2>
        <div className="menu-grid">
          {cat.items && cat.items.map(item => (
            <article key={item._id || item.name} className={`menu-item ${!item.isAvailable ? 'menu-item-unavailable' : ''}`}>
              <img className="menu-item-image" src={item.image || 'https://placehold.co/400x300?text=No+Image'} alt={item.name} />
              <div className="menu-item-content">
                <header className="menu-item-header">
                  <h3 className="menu-item-name">{item.name}</h3>
                  <span className="menu-item-price">${item.price.toFixed(2)}</span>
                </header>
                <p className="menu-item-description">{item.description}</p>
                <div className="menu-item-meta">
                  {item.preparationTime && <span className="menu-item-prep-time">⏱ {item.preparationTime} min</span>}
                  {!item.isAvailable && <span className="unavailable-badge">Unavailable</span>}
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    ))}
  </div>
);
export default Menu;