import Swal from "sweetalert2"; // ✅ Import SweetAlert2
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import './RetailorReg.css';

const initialUserState = {
    name: "",
    email: "",
    password: "",
    reEnterPassword: ""
};

const initialErrorState = {
    name: "",
    email: "",
    password: "",
    reEnterPassword: ""
};


const RetailorRegister = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(initialUserState);
    const [errors, setErrors] = useState(initialErrorState);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUser({
            ...user,
            [name]: value
        });
    };


    const validateForm = () => {
        let isValid = true;
        let newErrors = {};

        // Name validation
        if (!user.name) {
            isValid = false;
            newErrors["name"] = "Name is required.";
        }

        // Email validation
        if (!user.email) {
            isValid = false;
            newErrors["email"] = "Email is required.";
        } else if (!/\S+@\S+\.\S+/.test(user.email)) {
            isValid = false;
            newErrors["email"] = "Email is invalid.";
        }

        // Password validation
        if (!user.password) {
            isValid = false;
            newErrors["password"] = "Password is required.";
        } else if (user.password.length < 6) {
            isValid = false;
            newErrors["password"] = "Password must be at least 6 characters long.";
        }

        // Re-enter password validation
        if (user.password !== user.reEnterPassword) {
            isValid = false;
            newErrors["reEnterPassword"] = "Passwords do not match.";
        }

        setErrors(newErrors);
        return isValid;
    };


    const register = () => {
        if (validateForm()) {
            axios.post("http://localhost:9002/RETAILOR/register", user)
                .then(res => {
                    if (res.data.success) {
                        Swal.fire({
                            title: "Registration Successful!",
                            text: "You can now log in.",
                            icon: "success",
                            confirmButtonText: "OK"
                        }).then(() => {
                            navigate("/RETAILOR/login");
                        });
                    } else {
                        Swal.fire({
                            title: "Registration Failed",
                            text: res.data.message || "Something went wrong.",
                            icon: "error",
                            confirmButtonText: "OK"
                        });
                    }
                })
                .catch(error => {
                    if (error.response && error.response.status === 409) {
                        Swal.fire({
                            title: "User Already Exists!",
                            text: "This email is already registered. Please login instead.",
                            icon: "warning",
                            confirmButtonText: "OK"
                        });
                    } else {
                        Swal.fire({
                            title: "Error!",
                            text: "Something went wrong. Please try again.",
                            icon: "error",
                            confirmButtonText: "OK"
                        });
                    }
                });
        } else {
            Swal.fire({
                title: "Invalid Input",
                text: "Please check your details and try again.",
                icon: "error",
                confirmButtonText: "OK"
            });
        }
    };


    useEffect(() => {
        document.body.classList.add('ret-page');
        return () => {
            document.body.classList.remove('ret-page');
        };
    }, []);



    return (

        <div>

            <div className="ret-register-text">
                <p> <span style={{ color: " #ffc107 " }}>Retailor Register Page</span> of Eco Trace:<p>A Secure and Transparent </p><p>Supply Chain.</p></p>
            </div>

            <div className="ret-register-form">
                <h1 className="register-here">Create New Account</h1>
                <form autoComplete="off">
                    <div className="mb-3">
                        <label htmlFor="name" className="ret-form-label">Name</label>
                        <input
                            type="text"
                            className="ret-form-control"
                            id="name"
                            name="name"
                            value={user.name}
                            placeholder="Your Name"
                            onChange={handleChange}
                            autoComplete="off"
                        />
                        {errors.name && <div className="alert alert-danger">{errors.name}</div>}
                    </div>
                    <div className="mb-3">
                        <label htmlFor="email" className="ret-form-label">Email</label>
                        <input
                            type="email"
                            className="ret-form-control"
                            id="email"
                            name="email"
                            value={user.email}
                            placeholder="Your Email"
                            onChange={handleChange}
                            autoComplete="new-email"
                        />
                        {errors.email && <div className="alert alert-danger">{errors.email}</div>}
                    </div>
                    <div className="mb-3">
                        <label htmlFor="password" className="ret-form-label">Password</label>
                        <input
                            type="password"
                            className="ret-form-control"
                            id="password"
                            name="password"
                            value={user.password}
                            placeholder="Enter Your Password"
                            onChange={handleChange}
                            autoComplete="new-password"
                        />
                        {errors.password && <div className="alert alert-danger">{errors.password}</div>}
                    </div>
                    <div className="mb-3">
                        <label htmlFor="reEnterPassword" className="ret-form-label">Re-Enter Password</label>
                        <input
                            type="password"
                            className="ret-form-control"
                            id="reEnterPassword"
                            name="reEnterPassword"
                            value={user.reEnterPassword}
                            placeholder="Re-Enter Password"
                            onChange={handleChange}
                            autoComplete="new-password"
                        />
                        {errors.reEnterPassword && <div className="alert alert-danger">{errors.reEnterPassword}</div>}
                    </div>
                    <div className="button-register">
                        <button type="button" className="ret-btn-btn-primary1" onClick={register}>Register</button>
                        <button type="button" className="ret-btn-btn-secondary2" onClick={() => navigate('/RETAILOR/login')}>Login</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default RetailorRegister;
