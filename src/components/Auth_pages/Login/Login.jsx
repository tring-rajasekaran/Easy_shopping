import React, { useContext } from 'react'
import { useForm } from  'react-hook-form'
import '../Login/Style/Register.css'
import { Link, useNavigate } from 'react-router-dom'
// import { userContext } from '../App'
import { toast } from 'react-toastify'
import "react-toastify/dist/ReactToastify.css";
import axios from 'axios'
import Swal from 'sweetalert2'

// or via CommonJS



export const Login = () => { 

    const{register,setValue, handleSubmit,formState:{errors}}=useForm()
    const entered_type = new URLSearchParams(location.search).get('type')
    console.log(entered_type+" entered_Type");
    // const {user,setlogindata}=useContext(userContext)
    const navigate=useNavigate()
    // console.log(user);
    const onSubmit = async (data) => {
      console.log(entered_type+" entered type");
      
      const query = `
          query {
            login(
              email: "${data.email}",
              password: "${data.password}"
              ${entered_type === "shop_owner" ? `shopName: "hello"` : ""}
            )
              {
                message
                name 
                id 
            }
          }
        `;


      console.log(data.email +" "+ data.password+" details " + entered_type);
     
      try {
        const response = await axios.post("http://localhost:3030/graphql", { query });
        const responseData = response.data.data.login;
        console.log(responseData+" responce");
        // console.log(responseData.message+"message");
        
        if (responseData?.message === "User logged in successfully") {
            const username = responseData.name;
            const user_id = responseData.id;
            localStorage.setItem("username", username);
            localStorage.setItem("userid",user_id);
            if(entered_type==="customer"){
               localStorage.setItem("enteredas", "customer");
               toast.success("Login successful!");
               navigate("/Buy");
            }
            else {
              localStorage.setItem("enteredas","shopowner")
              Swal.fire({
                title: "Logged in!",
                icon: "success",
                draggable: true
              });
              navigate("/AddProduct");
            }
        }
        else if(responseData?.message ==="User not registered, please register."){
          Swal.fire({
            title: "User not found please Register",
            icon: "error",
            draggable: true
          });
          navigate(`/Register?type=${entered_type}`);
        }
      
        else {  
          Swal.fire({
            title: "Invalid password!",
            icon: "error",
          });
        }
      } catch (err) {
        toast.error("Login failed");
        console.log("Error: " + err.message);
      }
    };
  return (
    <div className='login-container'>
        <div className='form-wrapper'>
          <form  className='login-form' onSubmit={handleSubmit(onSubmit)}>
            <h1>{entered_type}</h1><br></br>
            <h1 style={{textAlign:"center"}}>Login</h1>
            <input 
              placeholder='Enter email'
              className='login-input'
               {...register("email", {required:"Email is empty" })}/>
            {errors.email &&  <p className="error-msg" >{errors.email.message}</p>}
            <input placeholder='Enter password' type='password' className='login-input' {...register("password", {required:"Password is empty"})}/>
            {errors.password && <p className="error-msg">{errors.password.message}</p>}
            <button className='login-input login-btn' type='submit'>Login</button>
            <p style={{textAlign:"center",fontSize:"14px"}}>Don't have an account? <Link onClick={()=> handle_link('customer')} className="navigate-btn" to={`/Register?type=${entered_type}`}>Register</Link> </p>
          </form>
        </div>
    </div>
  )
}