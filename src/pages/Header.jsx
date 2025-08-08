import React, { useState, useEffect } from 'react';
import { useCart } from '../pages/CartContext';
import { useAuth } from '../context/AuthContext';
import { useFavorites } from '../context/FavoritesContext';
import AuthModal from '../auth/AuthModal';
import CheckoutModal from '../auth/CheckoutModal';

const Header = () => {
  const [showCart, setShowCart] = useState(false);
  const [showFavorites, setShowFavorites] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  const {
    items,
    removeFromCart,
    updateQuantity,
    getTotalItems,
    getTotalPrice,
    clearCart
  } = useCart();

  const { user, isAuthenticated, logout } = useAuth();
  const { favorites, removeFromFavorites, getFavoritesCount } = useFavorites();

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
      if (window.innerWidth > 768) {
        setShowMobileMenu(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleCart = () => {
    setShowCart(!showCart);
    setShowFavorites(false);
    setShowUserMenu(false);
    setShowMobileMenu(false);
  };

  const toggleFavorites = () => {
    if (!isAuthenticated) {
      alert('Please login to view your favorites');
      setShowAuthModal(true);
      return;
    }
    setShowFavorites(!showFavorites);
    setShowCart(false);
    setShowUserMenu(false);
    setShowMobileMenu(false);
  };

  const toggleUserMenu = () => {
    setShowUserMenu(!showUserMenu);
    setShowCart(false);
    setShowFavorites(false);
    setShowMobileMenu(false);
  };

  const toggleMobileMenu = () => {
    setShowMobileMenu(!showMobileMenu);
    setShowCart(false);
    setShowFavorites(false);
    setShowUserMenu(false);
  };

  const handleCheckout = () => {
    if (items.length === 0) {
      alert('Your cart is empty!');
      return;
    }

    if (!isAuthenticated) {
      alert('Please login to proceed with checkout');
      setShowAuthModal(true);
      return;
    }

    setShowCart(false);
    setShowCheckoutModal(true);
  };

  const handleLogout = () => {
    logout();
    setShowUserMenu(false);
    setShowMobileMenu(false);
    alert('You have been logged out successfully!');
  };

  const handleNavClick = () => {
    setShowMobileMenu(false);
  };

  return (
    <div>
      <header>
        <nav className='header-nav'>
          <h1>
            <a style={{outline: 'none', textDecoration: 'none', color: 'white'}} href="">
              KugiHands
            </a>
          </h1>

          {/* Desktop Navigation */}
          {!isMobile && (
            <>
              <div className="nav-links">
                <a className='nav-all' href="#home">Home</a>
                <a className='nav-all' href="#about">About</a>
                <a className='nav-all' href="#product">Product</a>
                <a className='nav-all' href="#contact">Contact</a>
              </div>

              <div className="nav-actions">
                {/* Favorites Button */}
                <button className='favorites-toggle' onClick={toggleFavorites}>
                  <i className="fa-solid fa-heart"></i> Favorites {isAuthenticated ? `(${getFavoritesCount()})` : ''}
                </button>

                {/* Cart Button */}
                <button className='cart-toggle' onClick={toggleCart}>
                  <i className="fa-solid fa-cart-shopping"></i> ({getTotalItems()})
                </button>

                {/* User Authentication */}
                {isAuthenticated ? (
                  <div className="user-menu-container">
                    <button className='user-toggle' onClick={toggleUserMenu}>
                      <i className="fa-solid fa-user"></i> {user.firstName}
                    </button>
                    
                    {showUserMenu && (
                      <div className='user-dropdown'>
                        <div className='user-info'>
                          <p className='user-name'><strong>{user.firstName} {user.lastName}</strong></p>
                          <p className='user-email'>{user.email}</p>
                        </div>
                        <hr />
                        <button onClick={() => alert('Profile management coming soon!')}>
                          Edit Profile
                        </button>
                        <button onClick={() => alert('Order history coming soon!')}>
                          Order History
                        </button>
                        <button onClick={handleLogout} className='logout-btn'>
                          Logout
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <button className='login-toggle' onClick={() => setShowAuthModal(true)}>
                    Login
                  </button>
                )}
              </div>
            </>
          )}

          {/* Mobile Navigation */}
          {isMobile && (
            <>
              <div className="mobile-nav-actions">
                {/* Cart Button */}
                <button className='mobile-cart-toggle' onClick={toggleCart}>
                  <i className="fa-solid fa-cart-shopping"></i>
                  {getTotalItems() > 0 && <span className="cart-badge">{getTotalItems()}</span>}
                </button>

                {/* Hamburger Button */}
                <button className='hamburger-toggle' onClick={toggleMobileMenu}>
                  <div className={`hamburger ${showMobileMenu ? 'hamburger-active' : ''}`}>
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </button>
              </div>

              {/* Mobile Menu Overlay */}
              {showMobileMenu && (
                <div className="mobile-menu-overlay" onClick={toggleMobileMenu}>
                  <div className="mobile-menu" onClick={(e) => e.stopPropagation()}>
                    <div className="mobile-menu-header">
                      <h3>Menu</h3>
                      <button className="mobile-close-btn" onClick={toggleMobileMenu}>
                        <i className="fa-solid fa-times"></i>
                      </button>
                    </div>

                    <div className="mobile-menu-content">
                      <div className="mobile-nav-links">
                        <a className='mobile-nav-link' href="#home" onClick={handleNavClick}>Home</a>
                        <a className='mobile-nav-link' href="#about" onClick={handleNavClick}>About</a>
                        <a className='mobile-nav-link' href="#product" onClick={handleNavClick}>Product</a>
                        <a className='mobile-nav-link' href="#contact" onClick={handleNavClick}>Contact</a>
                      </div>

                      <hr className="mobile-divider" />

                      <div className="mobile-actions">
                        {/* Favorites */}
                        <button className='mobile-action-btn' onClick={toggleFavorites}>
                          <i className="fa-solid fa-heart"></i>
                          <span>Favorites {isAuthenticated ? `(${getFavoritesCount()})` : ''}</span>
                        </button>

                        {/* User Authentication */}
                        {isAuthenticated ? (
                          <div className="mobile-user-section">
                            <div className="mobile-user-info">
                              <i className="fa-solid fa-user"></i>
                              <div>
                                <p className="mobile-user-name">{user.firstName} {user.lastName}</p>
                                <p className="mobile-user-email">{user.email}</p>
                              </div>
                            </div>
                            <button className="mobile-action-btn" onClick={() => {alert('Profile management coming soon!'); setShowMobileMenu(false);}}>
                              <i className="fa-solid fa-edit"></i>
                              <span>Edit Profile</span>
                            </button>
                            <button className="mobile-action-btn" onClick={() => {alert('Order history coming soon!'); setShowMobileMenu(false);}}>
                              <i className="fa-solid fa-history"></i>
                              <span>Order History</span>
                            </button>
                            <button className="mobile-action-btn logout" onClick={handleLogout}>
                              <i className="fa-solid fa-sign-out-alt"></i>
                              <span>Logout</span>
                            </button>
                          </div>
                        ) : (
                          <button className='mobile-action-btn' onClick={() => {setShowAuthModal(true); setShowMobileMenu(false);}}>
                            <i className="fa-solid fa-sign-in-alt"></i>
                            <span>Login</span>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </nav>

        {/* Cart Dropdown */}
        {showCart && (
          <div className='cart-dropdown'>
            <div className='cart-header'>
              <h4>Shopping Cart</h4>
              <button className='close-btn' onClick={toggleCart}>X</button>
            </div>

            {items.length === 0 ? (
              <p style={{color: '#555', fontSize: '13px'}}>Empty</p>
            ) : (
              <div>
                <div className='cart-items'>
                  {items.map(item => (
                    <div key={item.id} className='cart-item'>
                      <img src={item.image} alt={item.name} width="50" />
                      <div className='item-details'>
                        <h4>{item.name}</h4>
                        <p style={{fontSize: '13px', marginTop: '5px', marginBottom: '5px'}} className='item-set'>{item.set}</p>
                        <p style={{color: '#e91e63'}} className='item-price'>
                          {isNaN(parseFloat(item.price))
                            ? item.price
                            : `₱${parseFloat(item.price.toString().replace('₱', '').replace(',', '')).toFixed(2)}`}
                        </p>
                        <div style={{textAlign: 'center'}} className='quantity-controls'>
                          <button onClick={() => updateQuantity(item.id, item.quantity - 1)}>-</button>
                          <span>{item.quantity}</span>
                          <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
                        </div>
                        <p className='delivery-option'>📦 {item.deliveryOption}</p>
                      </div>
                      <button style={{background: 'none', border: 'none', cursor: 'pointer'}} className='remove-btn' onClick={() => removeFromCart(item.id)}>
                        <i className="fa-solid fa-trash"></i>
                      </button>
                    </div>
                  ))}
                </div>

                <div className='cart-total'>
                  <h4>Total: ₱{getTotalPrice().toFixed(2)}</h4>
                  <div className='cart-actions'>
                    <button className='clear-btn' onClick={clearCart}>Clear Cart</button>
                    <button className='checkout-btn' onClick={handleCheckout}>Proceed to Checkout</button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Favorites Dropdown */}
        {showFavorites && (
          <div className='favorites-dropdown'>
            <div className='favorites-header'>
              <h4 className='favorites-title'>Your Favorites</h4>
            </div>
            <button className='closed-btn' onClick={toggleFavorites}>X</button>

            {favorites.length === 0 ? (
              <p style={{color: '#555', fontSize: '13px'}}>Empty</p>
            ) : (
              <div className='favorites-items'>
                {favorites.map(item => (
                  <div key={item.id} className='favorite-item'>
                    <img src={item.image} alt={item.name} width="50" />
                    <div className='item-details'>
                      <h4 className='item-name'>{item.name}</h4>
                      <p style={{fontSize: '13px', marginTop: '5px', marginBottom: '5px'}} className='item-set'>{item.set}</p>
                      <p style={{color: '#e91e63'}} className='item-price'>₱{item.price}</p>
                    </div>
                    <button 
                      className='remove-favorite-btn' 
                      onClick={() => removeFromFavorites(item.id)}
                    >
                      💔
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </header>

      {/* Modals */}
      <AuthModal 
        isOpen={showAuthModal} 
        onClose={() => setShowAuthModal(false)} 
      />
      <CheckoutModal 
        isOpen={showCheckoutModal} 
        onClose={() => setShowCheckoutModal(false)} 
      />

      <style jsx>{`
        /* Mobile Navigation Styles */
        .mobile-nav-actions {
          display: flex;
          align-items: center;
          gap: 15px;
        }

        .mobile-cart-toggle {
          position: relative;
          background: none;
          border: none;
          color: white;
          font-size: 18px;
          cursor: pointer;
          padding: 8px;
        }

        .cart-badge {
          position: absolute;
          top: -5px;
          right: -5px;
          background: #e91e63;
          color: white;
          border-radius: 50%;
          width: 18px;
          height: 18px;
          font-size: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
        }

        .hamburger-toggle {
          background: none;
          border: none;
          cursor: pointer;
          padding: 8px;
        }

        .hamburger {
          width: 25px;
          height: 20px;
          position: relative;
          transform: rotate(0deg);
          transition: 0.3s ease-in-out;
        }

        .hamburger span {
          display: block;
          position: absolute;
          height: 3px;
          width: 100%;
          background: white;
          border-radius: 2px;
          opacity: 1;
          left: 0;
          transform: rotate(0deg);
          transition: 0.25s ease-in-out;
        }

        .hamburger span:nth-child(1) {
          top: 0px;
        }

        .hamburger span:nth-child(2) {
          top: 8px;
        }

        .hamburger span:nth-child(3) {
          top: 16px;
        }

        .hamburger-active span:nth-child(1) {
          top: 8px;
          transform: rotate(135deg);
        }

        .hamburger-active span:nth-child(2) {
          opacity: 0;
          left: -60px;
        }

        .hamburger-active span:nth-child(3) {
          top: 8px;
          transform: rotate(-135deg);
        }

        .mobile-menu-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.5);
          z-index: 1000;
          display: flex;
          justify-content: flex-end;
        }

        .mobile-menu {
          background: white;
          width: 300px;
          height: 100%;
          overflow-y: auto;
          box-shadow: -2px 0 10px rgba(0, 0, 0, 0.1);
          animation: slideIn 0.3s ease-out;
        }

        @keyframes slideIn {
          from {
            transform: translateX(100%);
          }
          to {
            transform: translateX(0);
          }
        }

        .mobile-menu-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 20px;
          border-bottom: 1px solid #eee;
          background: #f8f9fa;
        }

        .mobile-menu-header h3 {
          margin: 0;
          color: #333;
          font-size: 18px;
        }

        .mobile-close-btn {
          background: none;
          border: none;
          font-size: 20px;
          cursor: pointer;
          color: #666;
          padding: 5px;
        }

        .mobile-menu-content {
          padding: 0;
        }

        .mobile-nav-links {
          padding: 20px 0;
        }

        .mobile-nav-link {
          display: block;
          padding: 15px 20px;
          color: #333;
          text-decoration: none;
          font-size: 16px;
          border-bottom: 1px solid #f0f0f0;
          transition: background-color 0.2s;
        }

        .mobile-nav-link:hover {
          background-color: #f8f9fa;
        }

        .mobile-divider {
          margin: 0;
          border: none;
          border-top: 1px solid #eee;
        }

        .mobile-actions {
          padding: 20px 0;
        }

        .mobile-action-btn {
          display: flex;
          align-items: center;
          width: 100%;
          padding: 15px 20px;
          background: none;
          border: none;
          text-align: left;
          cursor: pointer;
          font-size: 16px;
          color: #333;
          transition: background-color 0.2s;
          border-bottom: 1px solid #f0f0f0;
        }

        .mobile-action-btn:hover {
          background-color: #f8f9fa;
        }

        .mobile-action-btn.logout {
          color: #e91e63;
        }

        .mobile-action-btn i {
          margin-right: 15px;
          width: 20px;
          text-align: center;
        }

        .mobile-user-section {
          border-top: 1px solid #eee;
          padding-top: 20px;
        }

        .mobile-user-info {
          display: flex;
          align-items: center;
          padding: 15px 20px;
          background: #f8f9fa;
          margin-bottom: 10px;
        }

        .mobile-user-info i {
          margin-right: 15px;
          font-size: 24px;
          color: #666;
        }

        .mobile-user-name {
          font-weight: bold;
          margin: 0;
          color: #333;
          font-size: 16px;
        }

        .mobile-user-email {
          margin: 2px 0 0 0;
          color: #666;
          font-size: 14px;
        }

        /* Hide desktop nav on mobile */
        @media (max-width: 768px) {
          .nav-links,
          .nav-actions {
            display: none;
          }
        }

        /* Hide mobile nav on desktop */
        @media (min-width: 769px) {
          .mobile-nav-actions {
            display: none;
          }
        }
      `}</style>
    </div>
  );
};

export default Header;