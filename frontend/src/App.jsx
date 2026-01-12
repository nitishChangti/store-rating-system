import "./App.css";

import { Outlet, useNavigate } from "react-router-dom";
import { authService } from "./services/auth.js";
import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { authStart, authFailure, authSuccess } from "./store/authSlice";
import {Message} from './components/index.js'
export default function App() {
  const navigate = useNavigate()
  const dispatch = useDispatch();
  const {isAuthenticated,loading}= useSelector((state) => state.auth);
  useEffect(() => {
    if (isAuthenticated) return;

    const getCurrentUser = async () => {
      try {
        dispatch(authStart());
        const res= await authService.getCurrentUser();
        console.log("res in app.jsx",res);
        dispatch(
          authSuccess({
            user: res?.data?.data?.user,
            token: null,
          })
        );
        console.log( res?.data?.data?.user);
        if( res?.data?.data?.user?.role === 'user') return navigate('/');
        else if( res?.data?.data?.user?.role === 'admin') return navigate('/admin/dashboard')
          else if(res?.data?.data?.user?.role === 'store_owner') return navigate('/store-owner/dashboard')
      } catch (error) {
        dispatch(authFailure(null))
      }
    };
    getCurrentUser()
  }, [dispatch]);

  if (loading) {
    return null; 
  }

  return (
    <>
        <Message />
      <Outlet />
    </>
  );
}
