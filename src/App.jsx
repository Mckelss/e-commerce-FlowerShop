import React from 'react';
import './App.css';
import Header from './pages/Header';
import Home from './pages/Home';
import About from './pages/About';
import Contact from './pages/Contact';
import Products from './pages/Products';
import { CartProvider } from './pages/CartContext';
import { AuthProvider } from './context/AuthContext';
import { FavoritesProvider } from './context/FavoritesContext';

const App = () => {
  
  return (
    <AuthProvider>
      <CartProvider>
        <FavoritesProvider>
          <div className="app">
            <Header />
            <Home />
            <About />
            <Products />
            <Contact />
          </div>
        </FavoritesProvider>
      </CartProvider>
    </AuthProvider>
  );
};

export default App;