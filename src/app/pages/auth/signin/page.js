"use client"; // This directive makes the component a client component

import { signIn } from "next-auth/react";
import { useState } from "react";

const SignIn = () => {
  const [error, setError] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    const email = event.target.email.value;
    const password = event.target.password.value;

    const result = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });

    if (result.ok) {
      window.location.href = "/pages/dashboard";
    } else {
      setError("Failed to sign in");
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input name="email" type="email" placeholder="Email" required />
        <input name="password" type="password" placeholder="Password" required />
        <button type="submit">Sign In</button>
      </form>
      {error && <p>{error}</p>}
    </div>
  );
};

export default SignIn;
