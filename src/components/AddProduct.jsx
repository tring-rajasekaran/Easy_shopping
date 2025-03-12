import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import "../css/AddProduct.css";
import t_img from '../assets/slide_img/teddy.png'
import del from '../assets/auth_img/delete.png'
import { Link, useNavigate } from 'react-router-dom'
import Swal from 'sweetalert2'


export default function AddProduct() {
    const { register, handleSubmit, reset } = useForm();
    const [username, setUsername] = useState("");
    const shopOwnerId = localStorage.getItem("userid");
    const [img, setImg] = useState(null);
    const [popup, setPopup] = useState(false);
    const [logout,setLogout] = useState(false);

    const [sh_data, setSh_data] = useState([]);
    const navigate=useNavigate()

    const handleImageChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            setImg(URL.createObjectURL(file));
        }
    };

    useEffect(() => {
        const storedUsername = localStorage.getItem("username" );
        if (storedUsername) {
            setUsername(storedUsername);
        }
    }, []);

    const handleLogout = () => {
        
        

        localStorage.clear();
        navigate("/")
        window.location.reload();
    };

    const delete_funtion = async(id)=>{
        // console.log(product.id+"delete id");
        
        console.log(parseInt(id)+":id");
        
        const query = `
            mutation{
                delete_product(id:${id})
            }
        `
        try{
            const response = await axios.post("http://localhost:3030/graphql", { query });
            console.log(response.data.data.delete_product);
            if(response.data.data.delete_product ==="deleted"){
                setSh_data(pre=> pre.filter(id => id !== id));
                Swal.fire({
                    title: "Deleted Succes fully",
                    icon: "success",
                  });
            }
        }
        catch(err){
            console.log(err.message+"error");
            
        }
    }


    const shopowner_product_data = async () => {
        setPopup(true);
        const query = `
            query {
                data_for_shopowner(shopowner_product_id: ${shopOwnerId}) {	
                    name
                    description
                    img_url
                    price
                    location
                    id
                }
            }
        `;

        try {
            const response = await axios.post("http://localhost:3030/graphql", { query });
            const shopowner_data = response.data.data.data_for_shopowner;

            if (shopowner_data.length > 0) {
                setSh_data(shopowner_data);
                
            } else {
                console.log("No products found.");
            }
        } catch (err) {
            console.log("Error:", err.message);
        }
    };


    const onSubmit = async (data) => {
        console.log(data);
        const query = `
        mutation {
            addProduct(
            name: "${data.name}",
            description: "${data.description}",
            price: ${data.price},
            imageUrl: "${img}",
            shopOwnerId: ${localStorage.getItem("userid")},
            locationName: "${data.location}"
        )
      }
    `;
        try {
            const response = await axios.post("http://localhost:3030/graphql", { query });
            console.log(response.data);
            Swal.fire({
                position: "center",
                icon: "success",
                title: "Your product has been added",
                showConfirmButton: false,
                timer: 1500
              });
            setImg(null);
            reset();
        } catch (error) {
            console.error("Error adding product:", error);
        }
    };

    return (
        <>
            <nav className="navbar">
                <h1>Welcome, {username}</h1>
                <button className="logout-btn" onClick={handleLogout}>Logout</button>
            </nav>
            <div className="below-nav">
                <div className="container">
                    <h2>Add a New Product</h2>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="form-group">
                            <label>Product Name</label>
                            <input {...register("name")} placeholder="Enter product name" required />
                        </div>

                        <div className="form-group">
                            <label>Description</label>
                            <input {...register("description")} placeholder="Enter description" />
                        </div>

                        <div className="form-group">
                            <label>Price</label>
                            <input {...register("price")} type="number" placeholder="Enter price" required />
                        </div>

                        <div className="form-group">
                            <label>Choose Product Image</label>
                            <input
                                type="file"
                                accept="image/*"
                                {...register("imageFile")}
                                onChange={handleImageChange}
                            />
                        </div>
                        {
                            img &&
                            <div className="img">
                                <p>Product Image:</p>
                                <br></br>
                                <img src={img} alt="" width="200" />
                            </div>
                        }

                        <div className="form-group">
                            <label>Location</label>
                            <input {...register("location")} placeholder="Enter location" required />
                        </div>

                        <button type="submit" className="submit-btn">Add Product</button>
                    </form>
                </div>
                <div className="view-product">
                    <h1 className="h1-1" >View product that <h1 className="h1-2">YOU</h1>  have been added</h1>
                    <button type="submit" className="view-button" onClick={() => shopowner_product_data()}>view product</button>
                </div>


                {popup &&
                    (
                        <div className="add-whole-page">
                            <div className="cartton-img">
                                <img className="whole-page-img" src={t_img} alt="" />
                                <img className="whole-page-img1" src={del} onClick={() => setPopup(false)} alt="" />
                            </div>
                            <div className="button-div">
                                <div className="add-content">
                                    <div className="to-be-scroll">
                                        {sh_data.length > 0 ? (
                                            sh_data.map((product, index) => (
                                                <div key={index} className="product-card">
                                                    <div className="add-content-1">
                                                        <h2>{product.name}</h2>
                                                    </div>
                                                    <label className="dis">Description:</label> <br />
                                                    <div className="add-content-2">
                                                        <textarea className="dis-area" defaultValue={product.description} readOnly></textarea>
                                                        <img id="img" src={product.img_url} alt="Product" />
                                                    </div>
                                                    <div className="add-content-3">
                                                        <p>Price: {product.price} /- Only</p>
                                                        <button onClick={()=>delete_funtion(product.id)}>Delete</button>
                                                    </div>
                                                </div>
                                            ))
                                        ) : (
                                            <p>No products added</p>
                                        )}
                                    </div>


                                </div>
                            </div>
                        </div>

                    )

                }

            </div>
        </>
    );
}
