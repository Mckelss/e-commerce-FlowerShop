import React, { createContext, useContext, useReducer, useEffect } from 'react';

// Auth Context
const AuthContext = createContext();

// Auth Actions
const AUTH_ACTIONS = {
  LOGIN: 'LOGIN',
  LOGOUT: 'LOGOUT',
  REGISTER: 'REGISTER',
  UPDATE_PROFILE: 'UPDATE_PROFILE',
  LOAD_USER: 'LOAD_USER'
};

// Auth Reducer
const authReducer = (state, action) => {
  switch (action.type) {
    case AUTH_ACTIONS.LOGIN:
    case AUTH_ACTIONS.REGISTER:
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true
      };
    
    case AUTH_ACTIONS.LOGOUT:
      return {
        ...state,
        user: null,
        isAuthenticated: false
      };
    
    case AUTH_ACTIONS.UPDATE_PROFILE:
      return {
        ...state,
        user: { ...state.user, ...action.payload }
      };
    
    case AUTH_ACTIONS.LOAD_USER:
      return {
        ...state,
        user: action.payload,
        isAuthenticated: !!action.payload
      };
    
    default:
      return state;
  }
};

// Initial State
const initialState = {
  user: null,
  isAuthenticated: false
};

// Auth Provider Component
export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Load user from localStorage on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('kugihands-user');
    if (savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser);
        dispatch({ type: AUTH_ACTIONS.LOAD_USER, payload: parsedUser });
      } catch (error) {
        console.error('Error loading user from localStorage:', error);
        localStorage.removeItem('kugihands-user');
      }
    }
  }, []);

  // Save user to localStorage whenever user changes
  useEffect(() => {
    if (state.user) {
      localStorage.setItem('kugihands-user', JSON.stringify(state.user));
    } else {
      localStorage.removeItem('kugihands-user');
    }
  }, [state.user]);

  // Auth Actions
  const login = (email, password) => {
    // Get users from localStorage
    const users = JSON.parse(localStorage.getItem('kugihands-users') || '[]');
    const user = users.find(u => u.email === email && u.password === password);
    
    if (user) {
      const { password, ...userWithoutPassword } = user;
      dispatch({ type: AUTH_ACTIONS.LOGIN, payload: userWithoutPassword });
      return { success: true, message: 'Login successful!' };
    } else {
      return { success: false, message: 'Invalid email or password' };
    }
  };

  const register = (userData) => {
    // Get existing users
    const users = JSON.parse(localStorage.getItem('kugihands-users') || '[]');
    
    // Check if user already exists
    if (users.find(u => u.email === userData.email)) {
      return { success: false, message: 'User already exists with this email' };
    }

    // Create new user
    const newUser = {
      id: Date.now().toString(),
      ...userData,
      createdAt: new Date().toISOString(),
      favorites: []
    };

    // Save to users array
    users.push(newUser);
    localStorage.setItem('kugihands-users', JSON.stringify(users));

    // Login the user (exclude password from state)
    const { password, ...userWithoutPassword } = newUser;
    dispatch({ type: AUTH_ACTIONS.REGISTER, payload: userWithoutPassword });
    
    return { success: true, message: 'Registration successful!' };
  };

  const logout = () => {
    dispatch({ type: AUTH_ACTIONS.LOGOUT });
  };

  const updateProfile = (profileData) => {
    // Update in localStorage
    const users = JSON.parse(localStorage.getItem('kugihands-users') || '[]');
    const userIndex = users.findIndex(u => u.id === state.user.id);
    
    if (userIndex !== -1) {
      users[userIndex] = { ...users[userIndex], ...profileData };
      localStorage.setItem('kugihands-users', JSON.stringify(users));
      
      dispatch({ type: AUTH_ACTIONS.UPDATE_PROFILE, payload: profileData });
      return { success: true, message: 'Profile updated successfully!' };
    }
    
    return { success: false, message: 'Error updating profile' };
  };

  // Context Value
  const value = {
    user: state.user,
    isAuthenticated: state.isAuthenticated,
    login,
    register,
    logout,
    updateProfile
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom Hook to use Auth Context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;