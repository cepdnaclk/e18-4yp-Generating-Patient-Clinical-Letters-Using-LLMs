"use client";

import React, { useState } from "react";
import { TextField, Button } from "@mui/material";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import HomeIcon from "@/components/HomeNavigator";

const RegisterPage: React.FC<any> = (props) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [response, setResponse] = useState("");
  const router = useRouter();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    try {
      const response = await fetch("http://localhost:8080/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, password, email }),
      });

      const responseData = await response.json();
      if (!response.ok) {
        toast.error("Error occured");
        throw new Error("Failed to send message");
      }
      // console.log("Login success", response.json);
      router.push("/inputform");
    } catch (error: any) {
      console.log("Login failed", error.message);
    }
  };

  return (
    <div>
      <div className="relative auth-form-container">
        <Link href="/">
          <div className="absolute top-5 left-5">
            <ArrowBackRoundedIcon className="text-gray-400 font-bold" />
          </div>
        </Link>
        <label className="login-register-heading font-sans text-slate-200 font-medium mb-9 tracking-wider">
          Register
        </label>

        <form className="register-form" onSubmit={handleSubmit}>
          <label
            htmlFor="name"
            className="font-sans text-slate-200 font-normal mb-1"
          >
            Full name
          </label>
          <input
            className="h-9 bg-slate-300 opacity-95 rounded px-4 font-sans font-normal placeholder-gray-500 text-slate-800 mb-4"
            value={name}
            onChange={(e) => setName(e.target.value)}
            id="name"
            placeholder="full Name"
            name="name"
          />
          {/* {errors.name && <span className='text-danger'> {errors.name} </span>} */}

          <label
            htmlFor="email"
            className="font-sans text-slate-200 font-normal mb-1"
          >
            Email
          </label>
          <input
            className="h-9 bg-slate-300 opacity-95 rounded px-4 font-sans font-normal placeholder-gray-500 text-slate-800 mb-4"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            placeholder="youremail@gmail.com"
            id="email"
            name="email"
          />
          {/* {errors.email && <span className='text-danger'> {errors.email} </span>} */}

          <label
            htmlFor="password"
            className="font-sans text-slate-200 font-normal mb-1"
          >
            Password
          </label>
          <input
            className="h-9 bg-slate-300 opacity-95 rounded px-4 font-sans font-normal placeholder-gray-500 text-slate-800 mb-4"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            placeholder="********"
            id="password"
            name="password"
          />
          {/* {errors.password && <span className='text-danger'> {errors.password} </span>} */}

          {/* <Link href = "/">
                <button  className="linkSubmit mt-10 bg-violet-500 font-sans font-medium text-white tracking-widest" type="submit">Register</button>
            </Link>   */}

          <button
            className="linkSubmit mt-10 bg-violet-500 font-sans font-medium text-white tracking-widest"
            type="submit"
          >
            Register
          </button>
        </form>

        <Link href="/login">
          <button className="link-btn">
            Already have an account? Login here.
          </button>
        </Link>
      </div>
    </div>
  );
};

export default RegisterPage;
