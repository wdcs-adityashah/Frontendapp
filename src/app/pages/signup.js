"use client"
import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
export default function Signup(){
    const[name,setName] = useState();
    const[email,setEmail] = useState();
    const[password,setPassword] = useState();
    const [error, setError] = useState("");
    const router = useRouter();
    const handleSubmit = async (e) => {
        e.preventDefault();

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
                </div>
                <button type="submit" className="btn w-100 rounded-0 bg-white">Register</button>
            </form>
           </div>
        </div>
    )
}