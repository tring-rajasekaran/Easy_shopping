import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import '../css/Buy.css'
import del_img from '../assets/auth_img/delete.png'
import { UserContext } from "../App";
import Swal from 'sweetalert2'

export default function Buy() {
    const { register, handleSubmit } = useForm();
    const [username, setUsername] = useState("");
    const [openpopup, setOpenpopup] = useState(false);

    const [products, setProducts] = useState([]);
    const [locations, setLocations] = useState([]);

    const [selectedProduct, setSelectedProduct] = useState("");
    const [selectedLocation, setSelectedLocation] = useState("");

    const [selectedDetails, setSelectedDetails] = useState([]);

    const [LocationPop, setLocationPop] = useState("");

    // const {card_id , setCard_id} =useContext(UserContext);



    const [showPopup, setShowPopup] = useState();
    const [myLocation, setMylocation] = useState({
        latitude: "",
        longitude: ""

    })

    const navigate = useNavigate();

    const onSubmit = async (data) => {
        console.log(data);

        const query = `
            query {
                getProducts(productName: "${data.Product}", locationName: "${data.Location}") {
                    id
                    name
                    description
                    price
                    imageUrl
                    location
                }
            }
        `;

        try {
            const response = await axios.post("http://localhost:3030/graphql", { query });
            console.log(response.data);

            if (response.data.errors) {
                alert("Error fetching data!");
            } else {
                // alert("Products fetched successfully!");
                console.log("Fetched Products: ", response.data.data.getProducts);
                console.log(response.data.data.getProducts[0].id);

                localStorage.setItem("card_id", response.data.data.getProducts[0].id)
                // console.log((card_id+"new"));


                setSelectedDetails(response.data.data.getProducts)

                setShowPopup(true);
                console.log(showPopup + "res");

            }
        } catch (error) {
            console.error("Error fetching products:", error);
        }
    };


    const [address, setAddress] = useState("");
    useEffect(() => {
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const lat = position.coords.latitude;
                    const lon = position.coords.longitude;
                    setMylocation({ latitude: lat, longitude: lon });

                    fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`)
                        .then((response) => response.json())
                        .then((data) => {
                            setAddress(data.display_name);
                        })
                        .catch((error) => console.error("Error fetching address:", error));
                },
                (error) => {
                    console.error("Error getting location:", error);
                }
            );
        }
    }, []);
    console.log(address + "location");


    useEffect(() => {
        const storedUsername = localStorage.getItem("username");
        if (storedUsername) {
            setUsername(storedUsername.toUpperCase());
        }
    }, []);




    const set_products = async () => {
        try {
            const query = {
                query: `
                    query {
                            all_product{name }
                    } `
            };
            const response = await axios.post("http://localhost:3030/graphql", query);
            console.log(response.data.data.all_product + " ");
            setProducts(response.data.data.all_product);
        }
        catch (err) {
            console.error("Error fetching locations:", err.message);
        }
    }
    const all_location = async () => {
        try {
            const query = {
                query: `
                    query{
                        all_location{location }
                    }
                `
            };
            const response = await axios.post("http://localhost:3030/graphql", query);
            console.log(response.data.data.all_location + " ");
            setLocations(response.data.data.all_location)
        }
        catch (err) {
            console.error("Error fetching locations:", err.message);
        }
    }


    const fetchLocations = async (productName) => {
        // console.log("functioning");

        try {
            const query = { query: `query { get_location(name: "${productName}") { location } }` };
            const response = await axios.post("http://localhost:3030/graphql", query);
            console.log(JSON.stringify(response.data.data.get_location));

            setLocations(response.data.data.get_location);
            console.log();

        } catch (error) {
            console.error("Error fetching locations:", error.message);
        }
    };

    const fetchProducts = async (locationName) => {
        try {
            const query = { query: `query { get_product(location: "${locationName}") { name } }` };
            const response = await axios.post("http://localhost:3030/graphql", query);
            // console.log(JSON.stringify(response.data.data.get_product) +" responce");
            console.log(response);

            setProducts(response.data.data.get_product);
        } catch (error) {
            console.error("Error fetching products:", error.message);
        }
    };

    const saveProduct = async () => {
        const product_id = localStorage.getItem("card_id");
        const customer_id = localStorage.getItem("userid");
        console.log(product_id + " " + customer_id);


        if (!product_id || !customer_id) {
            console.error("Product ID or Customer ID is missing.");
            return;
        }

        const mutation = `
        mutation {
            addToCart(product_id: ${product_id}, customer_id: ${customer_id}) 
        }
    `;

        try {
            const response = await fetch("http://localhost:3030/graphql", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ query: mutation }),
            });

            const result = await response.json();
            Swal.fire({
                title: "Saved Successfully!",
                icon: "success",
              });
            console.log(result.data.addToCart.message);
        } catch (error) {
            console.error("Error adding to cart:", error);
        }
    };

    useEffect(() => {
        console.log(products + " ");
        console.log(locations + " ");

        all_location();
        set_products();
    }, []);

    const handleLogout = () => {
        console.log(">>>>DFSF");
        setOpenpopup(true);
    };
    const handleLocation = () => {
        // console.log(LocationPop+"pop");

        setLocationPop(true);
    }
    const reset_options = () => {
        // setSelectedLocation([]);
        // setSelectedProduct([]);
        navigate("/Buy")
    }
    const handlesave = () => {
        navigate("/UserCart")
    }

    return (
        <>
            <nav className="top-bar">
                <div className="welcome-text">
                    <h1>WELCOME {username && <span>{username}</span>}</h1>
                </div>
                <div>
                    <button className="logout-btn" onClick={() => handleLogout()}>LOGOUT</button>
                    <button className="location-btn" onClick={() => handleLocation()}>GET LOCATION</button>
                    <button className="location-btn" onClick={() => handlesave()}>SAVED PRODUCT</button>



                </div>
            </nav>
            <div className="content">
                {/* <h1>{address}</h1> */}
                <h1 className="heading">SELECT PRODUCT YOU WANT <br /> ELSE  <br />SEE WHAT PRODUCTS NEAR YOU</h1>
                <div className="dropdown-container">
                    <form className="below-dropdown-container" onSubmit={handleSubmit(onSubmit)}>
                        <div>
                            <select {...register("Product")} onChange={(e) => {
                                setLocations([])
                                setSelectedProduct(e.target.value);
                                fetchLocations(e.target.value);
                            }}>
                                <option value="">Select Product</option>
                                {products?.map((product, index) => (
                                    <option key={index} value={product.name}>{product.name}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <select {...register("Location")} onChange={(e) => {
                                setSelectedLocation(e.target.value);
                                // fetchProducts(e.target.value);
                            }}>
                                <option value="">Select Location</option>
                                {locations?.map((loc, index) => (
                                    <option key={index} value={loc.location}>{loc.location}</option>
                                ))}
                            </select>
                        </div>
                        <button className="get-details-button" type="submit">Get Details</button>
                        <button className="clear-details-button" type="button" onClick={() => reset_options()}>Clear Options</button>

                    </form>
                </div>
            </div>
            {openpopup && (
                <div className="whole-pop-up">
                    <div className="popup">
                        <img src={del_img} alt="" />
                        <h2>CONFIRM</h2>
                        <p>SURE LOGOUT</p>
                        <button type="button" onClick={() => navigate("/")}>Logout</button>
                        <button onClick={() => setOpenpopup(false)}>Cancel</button>
                    </div>
                </div>
            )}
            {LocationPop && (
                <div className="whole-pop-up">
                    <div className="location-popup">
                        <button onClick={() => setLocationPop(false)}>X</button>
                        <h1>{address}</h1>
                    </div>
                </div>
            )}
            {showPopup && (
                <div className="popup-overlay">
                    <div className="popup-content">
                        <h2>Product Details</h2><br />
                        <button className="close-button" onClick={() => setShowPopup(false)}>×</button>
                        {selectedDetails.map((product) => (
                            <div className="product-item">
                                <h3>{product.name}</h3>

                                <div className="name-des-img">
                                    <div className="description">
                                        <p><strong>Description:</strong></p>
                                        <textarea value={product.description} readOnly />
                                    </div>
                                    <div className="product-img">
                                        <img src={product.imageUrl} alt="Product" />
                                    </div>
                                </div>

                                <div className="price-location">
                                    <p><strong>Price:</strong> ${product.price}</p>
                                    <p><strong>Location:</strong> {product.location}</p>
                                </div>
                                <button className="save-button" onClick={() => saveProduct()}>Save</button>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </>
    );
}
