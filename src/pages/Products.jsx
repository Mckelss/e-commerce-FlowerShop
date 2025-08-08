import React, { useState } from 'react';
import { useCart } from '../pages/CartContext';
import { useFavorites } from '../context/FavoritesContext';
import { useAuth } from '../context/AuthContext';

const Products = () => {
  const { addToCart } = useCart();
  const { addToFavorites, removeFromFavorites, isFavorite } = useFavorites();
  const { isAuthenticated } = useAuth();
  
  // State to manage quantities and delivery options for each product
  const [productOptions, setProductOptions] = useState({});

  const handleQuantityChange = (productId, quantity) => {
    setProductOptions(prev => ({
      ...prev,
      [productId]: {
        ...prev[productId],
        quantity: parseInt(quantity) || 1
      }
    }));
  };

  const handleDeliveryChange = (productId, deliveryOption) => {
    setProductOptions(prev => ({
      ...prev,
      [productId]: {
        ...prev[productId],
        deliveryOption
      }
    }));
  };

  const getProductOption = (productId, option, defaultValue) => {
    return productOptions[productId]?.[option] || defaultValue;
  };

  const handleAddToCart = (product, productId) => {
    const quantity = getProductOption(productId, 'quantity', 1);
    const deliveryOption = getProductOption(productId, 'deliveryOption', 'delivery');
    
    const cartItem = {
      ...product,
      quantity,
      deliveryOption: deliveryOption === 'delivery' ? 'Delivery' : 'Pick-up',
      id: productId
    };

    addToCart(cartItem);
    
    // Show success message
    alert(`Added ${quantity} x ${product.name} (${product.set}) to cart!`);
  };

  const handleFavoriteToggle = (product, productId) => {
    if (!isAuthenticated) {
      alert('Please login to add items to favorites');
      return;
    }

    const favoriteItem = {
      ...product,
      id: productId
    };

    if (isFavorite(productId)) {
      removeFromFavorites(productId);
    } else {
      addToFavorites(favoriteItem);
    }
  };

  const ProductCard = ({ product, productId, badge, badgeType }) => (
    <div className="product-card">
      {badge && <span className={`badge ${badgeType}`}>{badge}</span>}
      
      <div className="product-image-container">
        <img src={product.image} alt={product.name} />
        <button 
          className={`favorite-btn ${isFavorite(productId) ? 'favorited' : ''}`}
          onClick={() => handleFavoriteToggle(product, productId)}
          title={isFavorite(productId) ? 'Remove from favorites' : 'Add to favorites'}
        >
          {isFavorite(productId) ? '❤️' : '🤍'}
        </button>
      </div>

      <div className="product-info">
        <h3>{product.set}</h3>
        <p className="price">
          {typeof product.price === 'string' ? product.price : `₱${product.price.toFixed(2)}`}
        </p>
        
        <div className="product-controls">
          <div className="quantity-container">
            <label htmlFor={`quantity-${productId}`}>Qty:</label>
            <input 
              id={`quantity-${productId}`}
              className="quantity" 
              type="number" 
              min="1" 
              value={getProductOption(productId, 'quantity', 1)}
              onChange={(e) => handleQuantityChange(productId, e.target.value)}
            />
          </div>
          
          <div className="delivery-options">
            <label className="radio-label">
              <input 
                type="radio" 
                name={`delivery-${productId}`}
                value="delivery" 
                checked={getProductOption(productId, 'deliveryOption', 'delivery') === 'delivery'}
                onChange={(e) => handleDeliveryChange(productId, e.target.value)}
              />
              <span className="radio-text">Delivery</span>
            </label>
            <label className="radio-label">
              <input 
                type="radio" 
                name={`delivery-${productId}`}
                value="pickup" 
                checked={getProductOption(productId, 'deliveryOption', 'delivery') === 'pickup'}
                onChange={(e) => handleDeliveryChange(productId, e.target.value)}
              />
              <span className="radio-text">Pick-up</span>
            </label>
          </div>
          
          <button 
            className="add-to-cart-btn"
            onClick={() => handleAddToCart(product, productId)}
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );

  const CustomCrochetCard = () => (
    <div className="product-card">
      <div className="product-image-container">
        <img src="./img/crochet/butterfly.jpg" alt="Customized Crochet" />
        <button 
          className={`favorite-btn ${isFavorite('crochet-custom') ? 'favorited' : ''}`}
          onClick={() => handleFavoriteToggle({
            name: 'Crochet Flowers',
            set: 'Customized',
            price: 'Price may vary',
            image: './img/crochet/butterfly.jpg',
            category: 'Crochet Flowers'
          }, 'crochet-custom')}
          title={isFavorite('crochet-custom') ? 'Remove from favorites' : 'Add to favorites'}
        >
          {isFavorite('crochet-custom') ? '❤️' : '🤍'}
        </button>
      </div>

      <div className="product-info">
        <h3>Customized</h3>
        <p className="price">Price may vary</p>
        
        <div className="product-controls">
          <div className="quantity-container">
            <label htmlFor="quantity-crochet-custom">Qty:</label>
            <input 
              id="quantity-crochet-custom"
              className="quantity" 
              type="number" 
              min="1" 
              value={getProductOption('crochet-custom', 'quantity', 1)}
              onChange={(e) => handleQuantityChange('crochet-custom', e.target.value)}
            />
          </div>
          
          <div className="delivery-options">
            <label className="radio-label">
              <input 
                type="radio" 
                name="delivery-crochet-custom" 
                value="delivery" 
                checked={getProductOption('crochet-custom', 'deliveryOption', 'delivery') === 'delivery'}
                onChange={(e) => handleDeliveryChange('crochet-custom', e.target.value)}
              />
              <span className="radio-text">Delivery</span>
            </label>
            <label className="radio-label">
              <input 
                type="radio" 
                name="delivery-crochet-custom" 
                value="pickup" 
                checked={getProductOption('crochet-custom', 'deliveryOption', 'delivery') === 'pickup'}
                onChange={(e) => handleDeliveryChange('crochet-custom', e.target.value)}
              />
              <span className="radio-text">Pick-up</span>
            </label>
          </div>
          
          <button 
            className="add-to-cart-btn"
            onClick={() => {
              const customPrice = prompt('Please enter the custom price for this item:', '500');
              if (customPrice && !isNaN(customPrice) && parseFloat(customPrice) > 0) {
                handleAddToCart({
                  name: 'Crochet Flowers',
                  set: 'Customized',
                  price: parseFloat(customPrice),
                  image: './img/crochet/butterfly.jpg',
                  category: 'Crochet Flowers'
                }, 'crochet-custom');
              } else if (customPrice !== null) {
                alert('Please enter a valid price');
              }
            }}
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div id="product">
      <div className="products-header">
        <h1>Our Products</h1>
      </div>
      
      <div className="products-container">
        <section className="product-section">
          <h2 className="section-title">Fresh Flowers</h2>
          <div className="product-grid">
            <ProductCard
              product={{
                name: 'Fresh Flowers',
                set: 'Set A',
                price: 380.00,
                image: './img/fresh/red.jpg',
                category: 'Fresh Flowers'
              }}
              productId="fresh-a"
              badge="New"
              badgeType="new"
            />

            <ProductCard
              product={{
                name: 'Fresh Flowers',
                set: 'Set B',
                price: 350.00,
                image: './img/fresh/yellow.jpg',
                category: 'Fresh Flowers'
              }}
              productId="fresh-b"
              badge="Sale"
              badgeType="sale"
            />
          </div>

          <h2 className="section-title">Mixed Flowers</h2>
          <div className="product-grid">
            <ProductCard
              product={{
                name: 'Mixed Flowers',
                set: 'Set A',
                price: 350.00,
                image: './img/mixed/pink.jpg',
                category: 'Mixed Flowers'
              }}
              productId="mixed-a"
              badge="Sale"
              badgeType="sale"
            />

            <ProductCard
              product={{
                name: 'Mixed Flowers',
                set: 'Set B',
                price: 400.00,
                image: './img/mixed/bluee.jpg',
                category: 'Mixed Flowers'
              }}
              productId="mixed-b"
              badge="New"
              badgeType="new"
            />

            <ProductCard
              product={{
                name: 'Mixed Flowers',
                set: 'Set C',
                price: 300.00,
                image: './img/mixed/green.jpg',
                category: 'Mixed Flowers'
              }}
              productId="mixed-c"
              badge="Sale"
              badgeType="sale"
            />
          </div>

          <h2 className="section-title">Crochet Flowers</h2>
          <div className="product-grid">
            <ProductCard
              product={{
                name: 'Crochet Flowers',
                set: 'Set A',
                price: 750.00,
                image: './img/crochet/real.jpg',
                category: 'Crochet Flowers'
              }}
              productId="crochet-a"
              badge="Sale"
              badgeType="sale"
            />

            <CustomCrochetCard />
          </div>
        </section>
      </div>

      <style jsx>{`
        .products-header {
          text-align: center;
          background: linear-gradient(135deg, #ffc0cb, #ff69b4);
          padding: 30px 20px;
          margin-bottom: 40px;
        }

        .products-header h1 {
          font-size: clamp(28px, 5vw, 48px);
          color: #e91e63;
          margin: 0;
          font-weight: 700;
          text-shadow: 2px 2px 4px rgba(0,0,0,0.1);
        }

        .products-container {
          max-width: 1400px;
          margin: 0 auto;
          padding: 0 20px;
        }

        .product-section {
          margin-bottom: 60px;
        }

        .section-title {
          font-size: clamp(24px, 4vw, 32px);
          color: #333;
          margin-bottom: 30px;
          text-align: center;
          font-weight: 600;
          position: relative;
        }

        .section-title::after {
          content: '';
          position: absolute;
          bottom: -10px;
          left: 50%;
          transform: translateX(-50%);
          width: 60px;
          height: 3px;
          background: #e91e63;
          border-radius: 2px;
        }

        .product-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 30px;
          margin-bottom: 50px;
        }

        .product-card {
          background: white;
          border-radius: 15px;
          box-shadow: 0 8px 25px rgba(0,0,0,0.1);
          overflow: hidden;
          position: relative;
          transition: all 0.3s ease;
          border: 1px solid #f0f0f0;
        }

        .product-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 15px 40px rgba(0,0,0,0.15);
        }

        .badge {
          position: absolute;
          top: 15px;
          left: 15px;
          padding: 6px 12px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 600;
          text-transform: uppercase;
          z-index: 2;
          letter-spacing: 0.5px;
        }

        .badge.new {
          background: #4CAF50;
          color: white;
        }

        .badge.sale {
          background: #FF5722;
          color: white;
        }

        .product-image-container {
          position: relative;
          width: 100%;
          height: 250px;
          overflow: hidden;
        }

        .product-image-container img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.3s ease;
        }

        .product-card:hover .product-image-container img {
          transform: scale(1.05);
        }

        .favorite-btn {
          position: absolute;
          top: 15px;
          right: 15px;
          background: rgba(255,255,255,0.9);
          border: none;
          border-radius: 50%;
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.3s ease;
          font-size: 18px;
          backdrop-filter: blur(10px);
        }

        .favorite-btn:hover {
          background: white;
          transform: scale(1.1);
        }

        .favorite-btn.favorited {
          background: rgba(233, 30, 99, 0.1);
        }

        .product-info {
          padding: 25px;
        }

        .product-info h3 {
          font-size: 20px;
          font-weight: 600;
          margin: 0 0 10px 0;
          color: #333;
        }

        .price {
          font-size: 24px;
          font-weight: 700;
          color: #e91e63;
          margin: 0 0 20px 0;
        }

        .product-controls {
          display: flex;
          flex-direction: column;
          gap: 15px;
        }

        .quantity-container {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .quantity-container label {
          font-weight: 600;
          color: #555;
          font-size: 14px;
        }

        .quantity {
          width: 60px;
          padding: 8px 12px;
          border: 2px solid #e0e0e0;
          border-radius: 8px;
          font-size: 16px;
          text-align: center;
          transition: border-color 0.3s ease;
        }

        .quantity:focus {
          outline: none;
          border-color: #e91e63;
        }

        .delivery-options {
          display: flex;
          gap: 15px;
          flex-wrap: wrap;
        }

        .radio-label {
          display: flex;
          align-items: center;
          cursor: pointer;
          gap: 8px;
          padding: 8px 12px;
          border-radius: 8px;
          transition: background-color 0.3s ease;
        }

        .radio-label:hover {
          background-color: #f5f5f5;
        }

        .radio-label input[type="radio"] {
          margin: 0;
        }

        .radio-text {
          font-size: 14px;
          color: #555;
          font-weight: 500;
        }

        .add-to-cart-btn {
          background: linear-gradient(135deg, #e91e63, #ad1457);
          color: white;
          border: none;
          padding: 12px 20px;
          border-radius: 8px;
          cursor: pointer;
          font-size: 16px;
          font-weight: 600;
          transition: all 0.3s ease;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .add-to-cart-btn:hover {
          background: linear-gradient(135deg, #ad1457, #880e4f);
          transform: translateY(-2px);
          box-shadow: 0 5px 15px rgba(233, 30, 99, 0.3);
        }

        .add-to-cart-btn:active {
          transform: translateY(0);
        }

        /* Mobile Responsive Styles */
        @media (max-width: 768px) {
          .products-container {
            padding: 0 15px;
          }

          .product-grid {
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 20px;
          }

          .product-card {
            border-radius: 12px;
          }

          .product-image-container {
            height: 200px;
          }

          .product-info {
            padding: 20px;
          }

          .product-info h3 {
            font-size: 18px;
          }

          .price {
            font-size: 20px;
          }

          .delivery-options {
            justify-content: space-between;
          }

          .radio-label {
            flex: 1;
            justify-content: center;
            padding: 10px 8px;
            background: #f8f9fa;
            border-radius: 6px;
            margin: 2px;
          }

          .add-to-cart-btn {
            padding: 14px 20px;
            font-size: 15px;
          }
        }

        @media (max-width: 480px) {
          .product-grid {
            grid-template-columns: 1fr;
            gap: 15px;
          }

          .products-header {
            padding: 20px 15px;
            margin-bottom: 30px;
          }

          .section-title {
            margin-bottom: 20px;
          }

          .product-info {
            padding: 15px;
          }

          .product-controls {
            gap: 12px;
          }

          .delivery-options {
            flex-direction: column;
            gap: 8px;
          }

          .radio-label {
            flex: none;
            padding: 12px;
            justify-content: flex-start;
          }
        }

        /* Very small screens */
        @media (max-width: 320px) {
          .products-container {
            padding: 0 10px;
          }

          .product-card {
            margin: 0 5px;
          }

          .product-image-container {
            height: 180px;
          }

          .favorite-btn {
            width: 35px;
            height: 35px;
            font-size: 16px;
          }
        }
      `}</style>
    </div>
  );
};

export default Products;