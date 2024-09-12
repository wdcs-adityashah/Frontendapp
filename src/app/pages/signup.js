"use client"
import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
export default function Signup(){
    const[name,setName] = useState();
    const[email,setEmail] = useState();
    const[password,setPassword] = useState();
    const [error, setError] = useState("");
    const [nameError, setNameError] = useState("");
    const [emailError, setEmailError] = useState("");
    const [passwordError, setPasswordError] = useState("");

    const router = useRouter();
    const validateForm = () => {
        let isValid = true;

        if (!name.trim()) {
            setNameError("Name is required.");
            isValid = false;
        } else {
            setNameError("");
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setEmailError("Invalid email address.");
            isValid = false;
        } else {
            setEmailError("");
        }

        if (password.length < 8) {
            setPasswordError("Password must be at least 8 characters long.");
            isValid = false;
        } else {
            setPasswordError("");
        }

        return isValid;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;
        try {
            const response = await axios.post('http://localhost:4010/api/register', { name, email, password });
            if (response.status === 201) { 
                router.push('/pages/login');
            } else {
                setError(response.data.message);
            }
        } catch (err) {
            console.error(err);
            setError("An error occurred. Please try again.");
        }
    };

    return(
        <div className="d-flex justify-center align-middle bg-slate-300">
           <div className="bg-white p-3 rounded-5">
            <h2>Register</h2>
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                 <label htmlFor="name">
                 <strong>Name</strong>
                 </label>
                 <input 
                 type="text"
                 placeholder="Enter name"
                 autoComplete="off"
                 name="name"
                 className="form-control rounded-0"
                 onChange={(e)=>setName(e.target.value)}
                 />
            {nameError && <p className="text-danger">{nameError}</p>}
                </div>
                <div className="mb-3">
                <label htmlFor="email">
                 <strong>Email</strong>
                </label>
                <input
                type="email"
                placeholder="Enter email"
                autoComplete="off"
                name="email"
                className="form-control rounded-0"
                onChange={(e)=>setEmail(e.target.value)}
                />
                {emailError && <p className="text-danger">{emailError}</p>}
                </div>
                <div className="mb-3">
                <label htmlFor="email">
                    <strong>password</strong>
                </label>
                <input
                type="password"
                placeholder="Enter password"
                autoComplete="off"
                name="password"
                className="form-control rounded-0"
             onChange={(e)=>setPassword(e.target.value)}
                />
                {passwordError && <p className="text-danger">{passwordError}</p>}
                </div>
                <button type="submit" className="btn w-100 rounded-0 bg-white">Register</button>
            </form>
            {error && <p className="text-danger">{error}</p>}
           </div>
        </div>
    )
}