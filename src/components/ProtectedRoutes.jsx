import React, { useEffect } from 'react'
import { Outlet } from 'react-router-dom'
import { Link, useNavigate } from "react-router-dom";

export default function ProtectedRoutes({children}) {
  const navigate=useNavigate()
  const checking_localstorage = localStorage.getItem("username")   
  useEffect(()=>{
        if(checking_localstorage===null){
            navigate("/");
        }
  })
  return children
}
