"use client";
import Image from "next/image";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import HomeIcon from "@/components/HomeNavigator";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import {
  Snackbar,
  Alert,
  AlertColor,
  SnackbarCloseReason,
} from "@mui/material";

interface State {
  vertical: "top" | "bottom";
  horizontal: "left" | "center" | "right";
}

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{ email?: string; password?: string }>(
    {}
  );
  const [isLoginClicked, setIsLoginClicked] = useState(false);
  const router = useRouter();
  const [isFormValid, setIsFormValid] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] =
    useState<AlertColor>("success");
  const [snackbarPosition, setSnackbarPosition] = useState<State>({
    vertical: "top",
    horizontal: "center",
  });

  const { vertical, horizontal } = snackbarPosition;

  const validateForm = () => {
    // let errors: any = {};
    // if (!email) {
    //   errors.email = 'Email is required.';
    // } else if (!/\S+@\S+\.\S+/.test(email)) {
    //   errors.email = 'Email is invalid.';
    // }
    // if (!password) {
    //   errors.password = 'Password is required.';
    // } else if (password.length < 6) {
    //   errors.password = 'Password must be at least 6 characters.';
    // }
    // setErrors(errors);
    // setIsFormValid(Object.keys(errors).length === 0);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsLoginClicked(true);
    // validateForm();

    // if (isFormValid) {

    if (email == "") {
      setSnackbarMessage("Enter email");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    } else if (password == "") {
      setSnackbarMessage("Enter password");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    } else {
      try {
        const response = await fetch("http://localhost:8080/api/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        });

        if (response.status == 200 || response.status == 402) {
          console.log("Login success", response);
          setSnackbarMessage("Login Success");
          setSnackbarSeverity("success");
          setSnackbarOpen(true);

          // Delay navigation to show snackbar
          setTimeout(() => {
            router.push("/inputform");
          }, 2000);
        } else if (response.status == 401) {
          console.log("Login failed", response.statusText);
          setSnackbarMessage("User does not exist");
          setSnackbarSeverity("error");
          setSnackbarOpen(true);
        } else if (response.status == 402) {
          console.log("Login failed", response.statusText);
          setSnackbarMessage("Invalid Password");
          setSnackbarSeverity("error");
          setSnackbarOpen(true);
        } else {
          console.log("Login failed", response.statusText);
          setSnackbarMessage("Login failed");
          setSnackbarSeverity("error");
          setSnackbarOpen(true);
        }
      } catch (error: any) {
        console.log("Login failed", error.message);
        setSnackbarMessage("Login Failed");
        setSnackbarSeverity("error");
        setSnackbarOpen(true);
      }
    }
  };

  const handleSnackbarClose = (
    event: Event | React.SyntheticEvent<any, Event>,
    reason?: SnackbarCloseReason
  ) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackbarOpen(false);
  };

  const handleAlertClose = (event: React.SyntheticEvent<Element, Event>) => {
    setSnackbarOpen(false);
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
          Login
        </label>
        <form className="login-form" onSubmit={handleSubmit}>
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
          {errors.email && <span className="text-danger">{errors.email}</span>}

          <label
            htmlFor="password"
            className="font-sans text-slate-200 font-normal mb-1"
          >
            Password
          </label>
          <input
            className="h-9 bg-slate-300 opacity-95 rounded px-4 font-sans font-normal placeholder-gray-500 text-slate-800"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            placeholder="********"
            id="password"
            name="password"
          />
          {errors.password && (
            <span className="text-danger">{errors.password}</span>
          )}

          <button
            className="linkSubmit mt-10 bg-violet-500 font-sans font-medium text-white tracking-widest"
            type="submit"
          >
            Login
          </button>
        </form>

        <Link href="/register">
          <button className="link-btn">
            Don't have an account? Register here.
          </button>
        </Link>
      </div>

      <Snackbar
        anchorOrigin={{ vertical, horizontal }}
        open={snackbarOpen}
        autoHideDuration={5000}
        onClose={handleSnackbarClose}
      >
        <Alert
          onClose={handleAlertClose}
          severity={snackbarSeverity}
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </div>
  );
}
