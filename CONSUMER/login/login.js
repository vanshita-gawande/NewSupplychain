import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2"; // ✅ Import SweetAlert2
import "bootstrap/dist/css/bootstrap.min.css";
import './ConsumerLogin.css';


const ConsumerLoginpage = ({ setLoginUser }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({
    email: "",
    password: "",
  });



  const handleChange = e => {
    const { name, value } = e.target;
    setUser({
      ...user,
      [name]: value
    });
  };

  const validateForm = () => {
    let isValid = true;
    let errors = {};

    // Email validation
    if (!user.email) {
      isValid = false;
      errors["email"] = "Email is required.";
    } else if (!/\S+@\S+\.\S+/.test(user.email)) {
      isValid = false;
      errors["email"] = "Email is invalid.";
    }

    // Password validation
    if (!user.password) {
      isValid = false;
      errors["password"] = "Password is required.";
    } else if (user.password.length < 6) {
      isValid = false;
      errors["password"] = "Password must be at least 6 characters and include at least one uppercase letter, one lowercase letter, one digit, and one special character.";
    }

    setErrors(errors);
    return isValid;
  };


  const login = async () => {
    if (validateForm()) {
      try {
        const res = await axios.post("http://localhost:9002/CONSUMER/login", user);


        if (res.data.success) {
          Swal.fire({
            title: "Login Successful!",
            text: res.data.message,
            icon: "success",
            confirmButtonText: "OK",
          }).then(() => {
            setLoginUser(res.data.consumer);
            navigate("/CONSUMER/homepage?section=insertDetails");
          });
        } else {
          Swal.fire({
            title: "Login Failed",
            text: res.data.message,
            icon: "error",
            confirmButtonText: "OK",
          });
        }
      } catch (error) {
        console.error("Login Error:", error);
        Swal.fire({
          title: "Error!",
          text: "Something went wrong. Please try again.",
          icon: "error",
          confirmButtonText: "OK",
        });
      }
    }
  };

  useEffect(() => {
    document.body.classList.add('conlogin-page');
    return () => {
      document.body.classList.remove('conlogin-page');
    };
  }, []);

  return (
    <div>


      <div className="con-login-text">
        <p><span style={{ color: " #ffc107 " }}>Consumer Login Page</span> of Eco Trace:<p>A Secure and Transparent </p><p>Supply Chain.</p></p>
      </div>


      <div className="con-log-container-formm">
        {/* Left Side Image */}


        <h1 className="log-in-welcome">WELCOME BACK !</h1>
        <form>
          <div className="mb-2">
            <label htmlFor="email" className="con-log-form-label">Email</label>
            <input
              type="email"
              className="con-log-form-control"
              id="email"
              name="email"
              value={user.email}
              onChange={handleChange}
              placeholder="Enter your email"
              required
            />
            {errors.password && <div className="alert alert-danger">{errors.password}</div>}

          </div>
          <div className="mb-3">
            <label htmlFor="password" className="con-log-form-label">Password</label>
            <input
              type="password"
              className="con-log-form-control"
              id="password"
              name="password"
              value={user.password}
              onChange={handleChange}
              placeholder="Enter your password"
              required
            />
            {errors.email && <div className="alert alert-danger">{errors.email}</div>}

          </div>
          <div className="con-log-button-containerr">
            <button type="button" className="con-log-btn-btn-primary11" onClick={login}>Login</button>

            {/*  <div className="separator">
              <span>or</span>
            </div> */}

            <button type="button" className="con-log-btn-btn-secondary11" onClick={() => navigate("/CONSUMER/register")}>Register</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ConsumerLoginpage;
