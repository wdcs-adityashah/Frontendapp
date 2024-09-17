"use client";

import { useFormik } from "formik";
import { useRouter } from "next/navigation";
import axios from "axios";
import * as Yup from "yup";
import Link from "next/link";
import { useState } from "react";

export default function Login() {
    const router = useRouter();
    const [error, setError] = useState(null);

    const validationSchema = Yup.object({
        email: Yup.string()
            .email("Invalid email address")
            .required("Email is required"),
        password: Yup.string()
            .min(6, "Password must be at least 6 characters")
            .required("Password is required"),
    });

    const formik = useFormik({
        initialValues: {
            email: "",
            password: ""
        },
        validationSchema: validationSchema,
        onSubmit: async (values) => {
            try {
                const result = await axios.post('http://192.168.109.149:4010/api/login', values);
                console.log(result);

                if (result.data.message === "Success") {
                    document.cookie = `token=${result.data.token};path=/`;
                    const authData = {
                        token: result.data.token,
                        session: result.data.session // Ensure this contains the `name` field
                    };

                    sessionStorage.setItem("authData", JSON.stringify(authData));
                    router.push('/dashboard');
                }
            } catch (err) {
                console.error(err);
                setError("Invalid credentials. Please try again.");
            }
        },
    });

    return (
        <div className="min-h-screen bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="bg-white shadow-xl rounded-lg p-10 max-w-md w-full space-y-8">
                <h2 className="text-left text-3xl font-extrabold text-red-800">Login</h2>

                {error && (
                    <div className="text-red-500 text-sm mb-4">{error}</div>
                )}

                <form onSubmit={formik.handleSubmit}>
                    <div className="mb-3">
                        <label htmlFor="email" className="block text-xl font-medium text-gray-700">
                            <strong>Email</strong>
                        </label>
                        <input
                            type="email"
                            name="email"
                            placeholder="Enter email"
                            className={`mt-1 block w-full px-4 py-3 border ${formik.touched.email && formik.errors.email ? 'border-red-500' : 'border-gray-300'} rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                            value={formik.values.email}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                        />
                        {formik.touched.email && formik.errors.email ? (
                            <div className="text-red-500 text-sm">{formik.errors.email}</div>
                        ) : null}
                    </div>

                    <div className="mb-3">
                        <label htmlFor="password" className="block text-xl font-medium text-gray-700">
                            <strong>Password</strong>
                        </label>
                        <input
                            type="password"
                            name="password"
                            placeholder="Enter password"
                            className={`mt-1 block w-full px-4 py-3 border ${formik.touched.password && formik.errors.password ? 'border-red-500' : 'border-gray-300'} rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                            value={formik.values.password}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                        />
                        {formik.touched.password && formik.errors.password ? (
                            <div className="text-red-500 text-sm">{formik.errors.password}</div>
                        ) : null}
                    </div>

                    <button type="submit" className="bg-black text-white w-full py-3 mb-5 rounded-lg">
                        Login
                    </button>
                    <p className="mb-5">Didn't  have an account?</p>
            <Link  href="/signUp"  className="bg-black text-white w-full px-3 py-3 rounded-lg mt-4">
                Register
            </Link>
                </form>
            </div>
        </div>
    );
}
