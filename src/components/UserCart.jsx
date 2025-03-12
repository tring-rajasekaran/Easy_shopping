import React, { useState, useEffect } from 'react';
import axios from 'axios';
import sample from '../assets/slide_img/slide1.jpg';
import '../css/UserCart.css';
import { FaLocationDot } from "react-icons/fa6";
import { FaIndianRupeeSign } from "react-icons/fa6";
import { IoReturnUpBackSharp } from "react-icons/io5";
import { FaInfoCircle } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { MdEmail } from "react-icons/md";


export default function UserCart() {
  const navigate = useNavigate();
  const [cart, setCart] = useState([]);
  const [infopopup, setInfopopup] = useState(false);
  const[cart_info , setCart_info] = useState({});

  useEffect(() => {
    fetching_cart();
  }, []);
  console.log((cart_info+" cart"));
  

  const fetching_cart = async () => {
    const cus_id = localStorage.getItem("userid");
    try {
      const query = {
        query: `
                    query {
                        get_customer_cart(customer_id: ${cus_id}) {
                            id
                            name
                            description
                            imageUrl
                            price
                            location
                            shopowner_product_id
                        }
                    }
                `
      };
      const response = await axios.post("http://localhost:3030/graphql", query);
      const cart_info = response.data.data.get_customer_cart;

      if (cart_info && cart_info.length > 0) {
        setCart(cart_info);
        console.log("details : ");
        
      } else {
        console.log("No products found.");
      }
    } catch (err) {
      console.error("Error fetching cart:", err);
    }
  };
  const go_back = () => {
    navigate("/Buy");
  }
  const get_info = async (shop_owner_id) => {
    console.log(shop_owner_id+" :id");

    try{
      const query ={
         query :`
             query{
                  get_shop_owner_info(product_id : ${shop_owner_id}){
                      shop_name
                      shopowner_name
                      shopowner_email
                  }
             }
         `
      }
      const response = await axios.post("http://localhost:3030/graphql", query);
      const shopowner_info = response.data.data.get_shop_owner_info;
      console.log((shopowner_info));
      
      console.log(shopowner_info);
    
        const {shop_name,shopowner_email,shopowner_name} = shopowner_info
        console.log(shop_name);
        setCart_info({
          shop_name,shopowner_email,shopowner_name
        })

    }
    catch(err){
        console.log("error in fetching data");
        
    }

    console.log(cart_info+" data");
    
    
    console.log("clicked");
    setInfopopup(true);
  }
  useEffect(()=>{
      console.log((cart_info)+"dadata");
      
  },[cart_info])

  const delete_cart=()=>{
     
  }

  return (
    <div className='user-cart-main'>
      <div className='top-bar'>
        <h2 onClick={() => go_back()}><IoReturnUpBackSharp /></h2>
        <h1>SAVED PRODUCT </h1>
      </div>

      
      {cart.length > 0 ? 
        <div>
        {cart.map((product) => (

            <div className='whole-cart'>
              <div className='single-cart' key={product.id}>
                <div className='info' onClick={()=> get_info(product.id)}><FaInfoCircle /></div>
                <h3>{product.name}   </h3>
                <h6>DESCRIPTION :</h6>
                <div className='des-img'>
                  {/* <p>description</p> */}
                  <textarea defaultValue={product.description} readOnly></textarea>
                  
                  <img src={product.imageUrl || sample} alt={product.name} />
                </div>
                <div className='price-location'>
                  <p><FaIndianRupeeSign /> {product.price} /-</p>
                  <p><FaLocationDot />{product.location}</p>
                  <button onClick={()=>delete_cart()}>Remove</button>
                </div>
              </div>
          </div>
        ))}
        </div>
       : (
        <p>No products in cart.</p>
      )}
      {infopopup &&
        <div className="whole-pop-up">
          <div className="info-popup">
          <button onClick={() => setInfopopup(false)}>X</button>
            <h1>SHOP DETAILS</h1>
            <h4>Shop name : {cart_info.shop_name}</h4>
            <h4>Shop owner name : {cart_info.shopowner_name}</h4>
            <h4>Shop owner email  : {cart_info.shopowner_email}</h4>
          </div>
        </div>
      }
    </div>
  );
}
