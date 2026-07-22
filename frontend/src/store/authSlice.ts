import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export type Role = 'PATIENT' | 'PHYSIOTHERAPIST' | 'ADMIN';

export interface User {
  id: string;
  email: string;
  role: Role;
  firstName?: string;
  lastName?: string;
}

interface AuthState {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
}

// Check local storage for initial state
const storedUser = localStorage.getItem('mova-user');
const initialState: AuthState = {
  user: storedUser ? JSON.parse(storedUser) : null,
  // The access token itself is never persisted (short-lived, memory-only);
  // it gets re-issued via the httpOnly refresh cookie on the next API call.
  accessToken: null,
  isAuthenticated: !!storedUser,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action: PayloadAction<{ user: User; accessToken: string }>) => {
      state.user = action.payload.user;
      state.accessToken = action.payload.accessToken;
      state.isAuthenticated = true;
      localStorage.setItem('mova-user', JSON.stringify(action.payload.user));
    },
    setAccessToken: (state, action: PayloadAction<string>) => {
      state.accessToken = action.payload;
    },
    logout: (state) => {
      state.user = null;
      state.accessToken = null;
      state.isAuthenticated = false;
      localStorage.removeItem('mova-user');
    },
  },
});

export const { setCredentials, setAccessToken, logout } = authSlice.actions;

export default authSlice.reducer;
