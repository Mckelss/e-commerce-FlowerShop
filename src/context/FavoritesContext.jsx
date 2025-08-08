import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

// Favorites Context
const FavoritesContext = createContext();

// Favorites Actions
const FAVORITES_ACTIONS = {
  ADD_FAVORITE: 'ADD_FAVORITE',
  REMOVE_FAVORITE: 'REMOVE_FAVORITE',
  LOAD_FAVORITES: 'LOAD_FAVORITES',
  CLEAR_FAVORITES: 'CLEAR_FAVORITES'
};

// Favorites Reducer
const favoritesReducer = (state, action) => {
  switch (action.type) {
    case FAVORITES_ACTIONS.ADD_FAVORITE:
      // Check if item already exists
      if (state.items.find(item => item.id === action.payload.id)) {
        return state;
      }
      return {
        ...state,
        items: [...state.items, action.payload]
      };

    case FAVORITES_ACTIONS.REMOVE_FAVORITE:
      return {
        ...state,
        items: state.items.filter(item => item.id !== action.payload.id)
      };

    case FAVORITES_ACTIONS.LOAD_FAVORITES:
      return {
        ...state,
        items: action.payload || []
      };

    case FAVORITES_ACTIONS.CLEAR_FAVORITES:
      return {
        ...state,
        items: []
      };

    default:
      return state;
  }
};

// Initial State
const initialState = {
  items: []
};

// Favorites Provider Component
export const FavoritesProvider = ({ children }) => {
  const [state, dispatch] = useReducer(favoritesReducer, initialState);
  const { user, isAuthenticated } = useAuth();

  // Load favorites when user changes
  useEffect(() => {
    if (isAuthenticated && user) {
      const userFavorites = localStorage.getItem(`kugihands-favorites-${user.id}`);
      if (userFavorites) {
        try {
          const parsedFavorites = JSON.parse(userFavorites);
          dispatch({ type: FAVORITES_ACTIONS.LOAD_FAVORITES, payload: parsedFavorites });
        } catch (error) {
          console.error('Error loading favorites:', error);
        }
      }
    } else {
      // Clear favorites when user logs out
      dispatch({ type: FAVORITES_ACTIONS.CLEAR_FAVORITES });
    }
  }, [user, isAuthenticated]);

  // Save favorites to localStorage whenever items change
  useEffect(() => {
    if (isAuthenticated && user) {
      localStorage.setItem(`kugihands-favorites-${user.id}`, JSON.stringify(state.items));
    }
  }, [state.items, user, isAuthenticated]);

  // Favorites Actions
  const addToFavorites = (product) => {
    if (!isAuthenticated) {
      alert('Please login to add items to favorites');
      return;
    }
    dispatch({ type: FAVORITES_ACTIONS.ADD_FAVORITE, payload: product });
  };

  const removeFromFavorites = (productId) => {
    dispatch({ type: FAVORITES_ACTIONS.REMOVE_FAVORITE, payload: { id: productId } });
  };

  const isFavorite = (productId) => {
    return state.items.some(item => item.id === productId);
  };

  const getFavoritesCount = () => {
    return state.items.length;
  };

  // Context Value
  const value = {
    favorites: state.items,
    addToFavorites,
    removeFromFavorites,
    isFavorite,
    getFavoritesCount
  };

  return (
    <FavoritesContext.Provider value={value}>
      {children}
    </FavoritesContext.Provider>
  );
};

// Custom Hook to use Favorites Context
export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
};

export default FavoritesContext;