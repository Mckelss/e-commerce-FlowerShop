import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../pages/CartContext';

const CheckoutModal = ({ isOpen, onClose }) => {
  const { user, isAuthenticated } = useAuth();
  const { items, getTotalPrice, clearCart } = useCart();
  
  const [currentStep, setCurrentStep] = useState(1);
  const [orderData, setOrderData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: 'Cagayan de Oro',
    specialInstructions: '',
    paymentMethod: 'cod',
    deliveryDate: '',
    deliveryTime: 'morning'
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // Pre-fill user data if authenticated
  useEffect(() => {
    if (isAuthenticated && user) {
      setOrderData(prev => ({
        ...prev,
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        phone: user.phone || '',
        address: user.address || ''
      }));
    }
  }, [isAuthenticated, user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setOrderData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateStep = (step) => {
    const newErrors = {};

    if (step === 1) {
      // Personal Information
      if (!orderData.firstName) newErrors.firstName = 'First name is required';
      if (!orderData.lastName) newErrors.lastName = 'Last name is required';
      if (!orderData.email) newErrors.email = 'Email is required';
      else if (!/\S+@\S+\.\S+/.test(orderData.email)) newErrors.email = 'Email is invalid';
      if (!orderData.phone) newErrors.phone = 'Phone number is required';
    }

    if (step === 2) {
      // Delivery Information
      if (!orderData.address) newErrors.address = 'Address is required';
      if (!orderData.deliveryDate) newErrors.deliveryDate = 'Delivery date is required';
      else {
        const selectedDate = new Date(orderData.deliveryDate);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        if (selectedDate < today) {
          newErrors.deliveryDate = 'Delivery date cannot be in the past';
        }
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => prev - 1);
  };

  const calculateDeliveryFee = () => {
    // Simple delivery fee calculation
    return items.some(item => item.deliveryOption === 'Delivery') ? 50 : 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateStep(2)) {
      return;
    }

    setLoading(true);

    try {
      // Create order object
      const order = {
        id: `ORDER-${Date.now()}`,
        userId: user?.id || 'guest',
        items: items,
        personalInfo: {
          firstName: orderData.firstName,
          lastName: orderData.lastName,
          email: orderData.email,
          phone: orderData.phone
        },
        deliveryInfo: {
          address: orderData.address,
          city: orderData.city,
          deliveryDate: orderData.deliveryDate,
          deliveryTime: orderData.deliveryTime,
          specialInstructions: orderData.specialInstructions
        },
        paymentMethod: orderData.paymentMethod,
        subtotal: getTotalPrice(),
        deliveryFee: calculateDeliveryFee(),
        total: getTotalPrice() + calculateDeliveryFee(),
        status: 'pending',
        createdAt: new Date().toISOString()
      };

      // Save order to localStorage (in real app, this would be an API call)
      const orders = JSON.parse(localStorage.getItem('kugihands-orders') || '[]');
      orders.push(order);
      localStorage.setItem('kugihands-orders', JSON.stringify(orders));

      // Generate order summary
      const orderSummary = items.map(item => {
        const price = parseFloat(item.price.toString().replace('₱', '').replace(',', ''));
        const total = isNaN(price) ? item.price : `₱${(price * item.quantity).toFixed(2)}`;
        return `${item.name} (${item.set}) - Qty: ${item.quantity} - ${total}`;
      }).join('\n');

      alert(`Order Placed Successfully! 🎉\n\nOrder ID: ${order.id}\n\n${orderSummary}\n\nSubtotal: ₱${order.subtotal.toFixed(2)}\nDelivery Fee: ₱${order.deliveryFee.toFixed(2)}\nTotal: ₱${order.total.toFixed(2)}\n\nWe'll contact you soon to confirm your order!`);

      // Clear cart and close modal
      clearCart();
      onClose();
      setCurrentStep(1);
      
    } catch (error) {
      setErrors({ general: 'An error occurred while placing your order. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const getTomorrowDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  };

  if (!isOpen) return null;

  return (
    <div className="checkout-modal-overlay" onClick={onClose}>
      <div className="checkout-modal" onClick={(e) => e.stopPropagation()}>
        <div className="checkout-header">
          <h2>Checkout</h2>
          <button className="close-btn" onClick={onClose}>&times;</button>
        </div>

        <div className="checkout-steps">
          <div className={`step ${currentStep >= 1 ? 'active' : ''}`}>
            <span>1</span> Personal Info
          </div>
          <div className={`step ${currentStep >= 2 ? 'active' : ''}`}>
            <span>2</span> Delivery & Payment
          </div>
          <div className={`step ${currentStep >= 3 ? 'active' : ''}`}>
            <span>3</span> Review Order
          </div>
        </div>

        <form onSubmit={handleSubmit} className="checkout-form">
          {errors.general && (
            <div className="error-message general-error">
              {errors.general}
            </div>
          )}

          {/* Step 1: Personal Information */}
          {currentStep === 1 && (
            <div className="checkout-step">
              <h3>Personal Information</h3>
              
              <div className="form-row">
                <div className="form-group">
                  <label>First Name *</label>
                  <input
                    type="text"
                    name="firstName"
                    value={orderData.firstName}
                    onChange={handleInputChange}
                    className={errors.firstName ? 'error' : ''}
                  />
                  {errors.firstName && <span className="error-text">{errors.firstName}</span>}
                </div>
                
                <div className="form-group">
                  <label>Last Name *</label>
                  <input
                    type="text"
                    name="lastName"
                    value={orderData.lastName}
                    onChange={handleInputChange}
                    className={errors.lastName ? 'error' : ''}
                  />
                  {errors.lastName && <span className="error-text">{errors.lastName}</span>}
                </div>
              </div>

              <div className="form-group">
                <label>Email Address *</label>
                <input
                  type="email"
                  name="email"
                  value={orderData.email}
                  onChange={handleInputChange}
                  className={errors.email ? 'error' : ''}
                />
                {errors.email && <span className="error-text">{errors.email}</span>}
              </div>

              <div className="form-group">
                <label>Phone Number *</label>
                <input
                  type="tel"
                  name="phone"
                  value={orderData.phone}
                  onChange={handleInputChange}
                  className={errors.phone ? 'error' : ''}
                />
                {errors.phone && <span className="error-text">{errors.phone}</span>}
              </div>
            </div>
          )}

          {/* Step 2: Delivery & Payment */}
          {currentStep === 2 && (
            <div className="checkout-step">
              <h3>Delivery & Payment Information</h3>
              
              <div className="form-group">
                <label>Delivery Address *</label>
                <textarea
                  name="address"
                  value={orderData.address}
                  onChange={handleInputChange}
                  className={errors.address ? 'error' : ''}
                  rows="3"
                  placeholder="Complete address with landmarks"
                />
                {errors.address && <span className="error-text">{errors.address}</span>}
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Delivery Date *</label>
                  <input
                    type="date"
                    name="deliveryDate"
                    value={orderData.deliveryDate}
                    onChange={handleInputChange}
                    min={getTomorrowDate()}
                    className={errors.deliveryDate ? 'error' : ''}
                  />
                  {errors.deliveryDate && <span className="error-text">{errors.deliveryDate}</span>}
                </div>
                
                <div className="form-group">
                  <label>Preferred Time</label>
                  <select
                    name="deliveryTime"
                    value={orderData.deliveryTime}
                    onChange={handleInputChange}
                  >
                    <option value="morning">Morning (8AM - 12PM)</option>
                    <option value="afternoon">Afternoon (12PM - 5PM)</option>
                    <option value="evening">Evening (5PM - 8PM)</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label>Special Instructions</label>
                <textarea
                  name="specialInstructions"
                  value={orderData.specialInstructions}
                  onChange={handleInputChange}
                  rows="2"
                  placeholder="Any special instructions for delivery or arrangement..."
                />
              </div>

              <div className="form-group">
                <label>Payment Method</label>
                <div className="payment-options">
                  <label className="payment-option">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="cod"
                      checked={orderData.paymentMethod === 'cod'}
                      onChange={handleInputChange}
                    />
                    Cash on Delivery
                  </label>
                  <label className="payment-option">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="gcash"
                      checked={orderData.paymentMethod === 'gcash'}
                      onChange={handleInputChange}
                    />
                    GCash
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Order Review */}
          {currentStep === 3 && (
            <div className="checkout-step">
              <h3>Review Your Order</h3>
              
              <div className="order-summary">
                <div className="customer-info">
                  <h4>Customer Information</h4>
                  <p><strong>Name:</strong> {orderData.firstName} {orderData.lastName}</p>
                  <p><strong>Email:</strong> {orderData.email}</p>
                  <p><strong>Phone:</strong> {orderData.phone}</p>
                  <p><strong>Address:</strong> {orderData.address}</p>
                  <p><strong>Delivery Date:</strong> {orderData.deliveryDate}</p>
                  <p><strong>Delivery Time:</strong> {orderData.deliveryTime}</p>
                  <p><strong>Payment Method:</strong> {orderData.paymentMethod === 'cod' ? 'Cash on Delivery' : 'GCash'}</p>
                </div>

                <div className="items-summary">
                  <h4>Order Items</h4>
                  {items.map(item => (
                    <div key={item.id} className="order-item">
                      <img src={item.image} alt={item.name} width="50" />
                      <div className="item-details">
                        <h5>{item.name} ({item.set})</h5>
                        <p>Quantity: {item.quantity}</p>
                        <p>Price: ₱{parseFloat(item.price.toString().replace('₱', '').replace(',', '')).toFixed(2)}</p>
                        <p>Total: ₱{(parseFloat(item.price.toString().replace('₱', '').replace(',', '')) * item.quantity).toFixed(2)}</p>
                        <p>Option: {item.deliveryOption}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="price-breakdown">
                  <div className="price-row">
                    <span>Subtotal:</span>
                    <span>₱{getTotalPrice().toFixed(2)}</span>
                  </div>
                  <div className="price-row">
                    <span>Delivery Fee:</span>
                    <span>₱{calculateDeliveryFee().toFixed(2)}</span>
                  </div>
                  <div className="price-row total">
                    <span><strong>Total:</strong></span>
                    <span><strong>₱{(getTotalPrice() + calculateDeliveryFee()).toFixed(2)}</strong></span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="checkout-navigation">
            {currentStep > 1 && (
              <button type="button" onClick={prevStep} className="btn-secondary">
                Previous
              </button>
            )}
            
            {currentStep < 3 ? (
              <button type="button" onClick={nextStep} className="btn-primary">
                Next
              </button>
            ) : (
              <button 
                type="submit" 
                className="btn-primary checkout-submit"
                disabled={loading}
              >
                {loading ? 'Processing...' : 'Place Order'}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default CheckoutModal;