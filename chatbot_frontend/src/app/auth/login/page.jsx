"use client";
import React, { useState, useEffect } from "react";
import styled from "styled-components";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";

const loader = "/images/loader.gif";
const Logo = "/images/chatbot.png";

function Login() {
  const [values, setValues] = useState({
    email: "",
    password: "",
  });
  const toastOptions = {
    position: "bottom-right",
    autoClose: 3000,
    pauseOnHover: true,
    closeOnClick: true,
    draggable: true,
    theme: "dark",
  };

  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("chatbot-user"));
    console.log("user localstorage :", user);
    if (user) {
      router.push("/");
    }
  }, []);

  const handleValidation = () => {
    const { email, password } = values;
    if (email.length < 3) {
      toast.error("email must be at least 3 characters long", toastOptions);
      return false;
    } else if (password.length < 3) {
      toast.error("Password must be at least 6 characters long", toastOptions);
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    setIsLoading(true);
    e.preventDefault();

    if (handleValidation()) {
      const { email, password } = values;
      let formData = new FormData();
      formData.append("username", email);
      formData.append("password", password);

      try {
        const { data } = await axios.post("/users/signin", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        console.log("login response: " + data);

        if (data) {
          localStorage.setItem("chatbot-user", JSON.stringify(data));
          const user = await JSON.parse(localStorage.getItem("chatbot-user"));
          if (user.access_token) {
            router.push("/");
          }
        }

        setIsLoading(false);
      } catch (err) {
        if (err.response && err.response.data && err.response.data.detail) {
          toast.error(err.response.data.detail, toastOptions);
        } else {
          toast.error("Failed to create user, Try again", toastOptions);
        }
        setIsLoading(false);
      }
    }
    setIsLoading(false);

  };

  const handleChange = (e) => {
    setValues({
      ...values,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <>
      {isLoading ? (
        <div className="h-screen w-screen bg-[#09091d] flex flex-col justify-center items-center">
          <img src={loader} className="h-80 w-80" />
        </div>
      ) : (
        <div className="h-screen w-screen bg-[#09091d] flex flex-col justify-center items-center">
          <form
            onSubmit={(e) => handleSubmit(e)}
            className="bg-[#00000076] rounded-xl p-12 flex flex-col justify-center items-center"
          >
            <div className="flex justify-center items-center gap-4">
              <img src={Logo} alt="Logo Image" className="h-20" />
            </div>

            <input
              type="text"
              placeholder="email"
              name="email"
              onChange={(e) => handleChange(e)}
              className="bg-transparent py-2 border-[0.1rem] border-[#4e0eff] flex flex-col rounded-md text-white text-base my-4 w-full focus:border-[#997af0] focus:outline-none"
            />
            <input
              type="password"
              placeholder="Password"
              name="password"
              onChange={(e) => handleChange(e)}
              className="bg-transparent py-2 border-[0.1rem] border-[#4e0eff] flex flex-col rounded-md text-white text-base my-4 w-full focus:border-[#997af0] focus:outline-none"
            />

            <button
              type="submit"
              className="bg-[#4e0eff] text-white py-2 px-8 border-none w-full font-bold cursor-pointer rounded-md text-base uppercase transition-colors duration-500 ease-in-out hover:bg-[#997af0]"
            >
              Login
            </button>
            <span className="text-white uppercase block text-center mt-4">
              Create an account?{" "}
              <Link
                href="/auth/signup"
                className="text-[#4e0eff] no-underline font-bold"
              >
                &nbsp; Register
              </Link>
            </span>
          </form>
        </div>
      )}
      <ToastContainer />
    </>
  );
}

export default Login;
