import React, { useEffect } from 'react'
import { Navigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { hideLoading, showLoading } from '../Redux/features/alertSlice';
import axios from 'axios';
import { setUser } from '../Redux/features/userSlice';

export default function ProtectRoute({children}) {
   const dispatch=useDispatch();
   const {user}=useSelector((state)=>state.user)

//eslint-disable-next-line
   const getUser=async()=>{
      try{
         dispatch(showLoading())
         const res = await axios.post('/api/v1/user/get_User_data',
            {
               token:localStorage.getItem('token'),
            },
            {
               headers:{
                  Authorization:`Bearer ${localStorage.getItem('token')}`
               }
            }
         )
         dispatch(hideLoading())
         if(res.data.success){
            dispatch(setUser(res.data.data))

         }else{
            <Navigate to='/login'/>;
            localStorage.clear();
         }
      }catch(error){
         dispatch(hideLoading())
         localStorage.clear()
         console.log(error);
      }
   }
   useEffect(()=>{
      if(!user){
         getUser();
      }
   },[user,getUser])
 if(localStorage.getItem('token')){
    return children;
 }
 else{
    return <Navigate to="/login"/>
 }
}



