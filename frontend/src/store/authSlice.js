import { createSlice } from "@reduxjs/toolkit";
import { tr } from "zod/locales";

const initialState = {
  user: null, 
  token: null, 
  isAuthenticated: false,
  loading: false,
  error: null,
   passwordUpdated: false,
   message: null, 
};

const authSlice = createSlice({
  name:'auth',
  initialState,
  reducers:{
    authStart(state){
        state.loading=true;
        state.error=null;
    },

    authSuccess(state,action){
        state.loading=false;
        state.user=action.payload.user;
        state.token=action.payload.token;
        state.isAuthenticated=true;
        state.error=null;
    },
    authFailure(state,action){
        state.loading=false;
        state.error= action.payload;
        state.isAuthenticated=false;
    },
    logout(state){
        state.user= null;
        state.token=null;
        state.isAuthenticated=false;
        state.loading=false;
        state.error=null;
    },

    updatePasswordStart(state) {
      state.loading = true;
      state.error = null;
      state.passwordUpdated = false;
    },

    updatePasswordSuccess(state) {
      state.loading = false;
      state.passwordUpdated = true;
    },

    updatePasswordFailure(state, action) {
      state.loading = false;
      state.error = action.payload;
      state.passwordUpdated = false;
    },

    resetPasswordState(state) {
      state.passwordUpdated = false;
      state.error = null;
    },

    setMessage(state, action) {
      state.message = action.payload;
    },

    clearMessage(state) {
      state.message = null;
    },
  }
});

export const {
    authStart,
    authSuccess,
    authFailure,
    logout,
    updatePasswordStart,
    updatePasswordSuccess,
    updatePasswordFailure,  
    resetPasswordState,
     setMessage,
  clearMessage,
} = authSlice.actions;

export default authSlice.reducer