"use client"
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import axios from "axios";

export default function Signup(){

    const router = useRouter();
    const validationSchema = Yup.object({
      name: Yup.string().required("Name is required"),
      email: Yup.string()
        .email("Invalid email address")
        .required("Email is required"),
      password: Yup.string()
        .min(8, "Password must be at least 8 characters long")
        .required("Password is required"),
    });
  
    const handleSubmit = async (values, { setSubmitting, setErrors }) => {
      try {
        const response = await axios.post("http://localhost:4010/api/register", {
          name: values.name,
          email: values.email,
          password: values.password,
        });
  
        if (response.status === 201) {
          router.push("/login");
        } else {
          setErrors({ general: response.data.message });
        }
      } catch (err) {
        console.error(err);
        setErrors({ general: "An error occurred. Please try again." });
      } finally {
        setSubmitting(false);
      }
    };
  
    return (
      <div className="min-h-screen bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow-xl rounded-lg p-10 max-w-md w-full space-y-8">
          <h2 className="text-left text-3xl font-extrabold text-red-800">
            Register
          </h2>
  
          <Formik
            initialValues={{ name: "", email: "", password: "" }}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting, errors }) => (
              <Form>
                {errors.general && (
                  <div className="text-red-500 text-sm">{errors.general}</div>
                )}
  
                <div className="relative">
                  <label
                    htmlFor="name"
                    className="block text-xl font-medium text-gray-700"
                  >
                    Name
                  </label>
                  <Field
                    type="text"
                    name="name"
                    placeholder="Enter your name"
                    className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm  focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                  <ErrorMessage
                    name="name"
                    component="div"
                    className="text-red-500 text-sm"
                  />
                </div>
  
                <div className="relative">
                  <label
                    htmlFor="email"
                    className="block text-xl font-medium text-gray-700 mt-5"
                  >
                    Email Address
                  </label>
                  <Field
                    type="email"
                    name="email"
                    placeholder="Enter your email"
                    className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                  <ErrorMessage
                    name="email"
                    component="div"
                    className="text-red-500 text-sm"
                  />
                </div>
  
                <div className="relative">
                  <label
                    htmlFor="password"
                    className="block text-xl font-medium text-gray-700 mt-5"
                  >
                    Password
                  </label>
                  <Field
                    type="password"
                    name="password"
                    placeholder="Enter your password"
                    className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                  <ErrorMessage
                    name="password"
                    component="div"
                    className="text-red-500 text-sm"
                  />
                </div>
  
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-black text-white w-full py-3 rounded-lg mb-5 mt-5"
                >
                  Register
                </button>

            <p className="mb-5">Already have an account</p>
            <Link href="/login"  className="bg-black text-white w-full px-3 py-3 rounded-lg mt-4">
                Login
            </Link>
              </Form>

            )}
          </Formik>
        </div>
      </div>
    );
}