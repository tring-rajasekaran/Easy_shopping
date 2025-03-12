import React from 'react'
import { Route, Routes } from "react-router-dom"
import App from '../App'
import Options from '../components/options'
import { Login } from '../components/Auth_pages/Login/Login'
import { Register } from '../components/Auth_pages/Register/Register'
import Buy from '../components/Buy'
import AddProduct from '../components/AddProduct'
import ProtectedRoutes from '../components/ProtectedRoutes'
import UserCart from '../components/UserCart'

const Router=()=>{
    return(
        <Router>
        <Routes>
            <Route path="/" element={<App/>}/>
            <Route path='/' element={<Options/>}/>
            <Route path='/Login' element={<Login/>}/>
            <Route path='/Register' element={<Register/>}/>
            <Route path='/Buy' element={
                <ProtectedRoutes>
                    <Buy/>
                </ProtectedRoutes>}/>
            
                <Route path='/AddProduct' element={
                    <ProtectedRoutes>
                        <AddProduct/>
                    </ProtectedRoutes>}/>
            <Route path='/UserCart' element={<UserCart/>}/>
        </Routes>
        </Router>
        
    )
} 

export default Router
