import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import "react-toastify/dist/ReactToastify.css";
import { yupResolver } from "@hookform/resolvers/yup";
import Swal from 'sweetalert2'
import * as yup from "yup";

export const Register = () => {

  const schema = yup.object().shape({
    shop_name: yup.string().when("enteredas", (enteredas, schema) => {
      return enteredas === "shop_owner" ? schema.required("Shop name is required") : schema;
    }),
    name: yup.string().required("Name is required"),
    email: yup.string().email("Invalid email").required("Email is required"),
    password: yup.string().min(4, "Password must be at least 4 characters").required("Password is required"),
  });


  const location = useLocation();
  const navigate = useNavigate();

  const {
    register,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema) });

  const entered_type = new URLSearchParams(location.search).get("type");

  useEffect(() => {
    if (entered_type) {
      setValue("enteredas", entered_type);
    }
  }, [entered_type, setValue]);

  const onSubmit = async (data) => {
    console.log("Form Data:", data);

    const query = `mutation {
      register(
        username: "${data.name}",
        email: "${data.email}",
        password: "${data.password}"
        ${entered_type === "shop_owner" ? `shopName: "${data.shop_name}"` : ""}
      )
    }`;

    try {
      const response = await axios.post("http://localhost:3030/graphql", { query });
      console.log("Full Response:", response.data);

      const responseData = response.data.data?.register;

      if (responseData === "user already logged in please login") {
        Swal.fire({
          title: "User already register please login",
          icon: "error",
        });
        navigate(`/Login?type=${entered_type}`);
      } else if (responseData === "Registration successful") {
        Swal.fire({
          title: "User Registered Successfully",
          icon: "success",
        });
        navigate(`/Login?type=${entered_type}`);
      } else {
        Swal.fire({
          title: "User Registration failed",
          icon: "error",
        });
      }
    } catch (err) {
      Swal.fire({
        title: "Error while register",
        icon: "error",
      });
      console.error("Error occurred:", err.message);
    }
  };

  return (
    <div className="login-container">
      <div className="form-wrapper">
        <form className="login-form" onSubmit={handleSubmit(onSubmit)}>
          <h1 style={{ textAlign: "center" }}>Register</h1>
          <select className="drop-down" disabled {...register("enteredas")}>
            <option value="customer">CUSTOMER</option>
            <option value="shop_owner">SHOP-OWNER</option>
          </select>
          {entered_type === "shop_owner" && (
            <>
              <input type="text" placeholder="Enter shop name" className="login-input" {...register("shop_name")} />
              {errors.shop_name && <p className="error-msg">{errors.shop_name.message}</p>}
            </>
          )}
          <input type="text" placeholder="Enter name" className="login-input" {...register("name")} />
          {errors.name && <p className="error-msg">{errors.name.message}</p>}
          <input type="email" placeholder="Enter email" className="login-input" {...register("email")} />
          {errors.email && <p className="error-msg">{errors.email.message}</p>}
          <input type="password" placeholder="Enter password" className="login-input" {...register("password")} />
          {errors.password && <p className="error-msg">{errors.password.message}</p>}
          <button className="login-input login-btn" type="submit">Register</button>
          <p style={{ textAlign: "center", fontSize: "14px" }}>
            Have an account? <Link className="navigate-btn" to={`/Login?type=${entered_type}`}>Login</Link>
          </p>
        </form>
      </div>
    </div>
  );
};
