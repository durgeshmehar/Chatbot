"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";

const loader = "/images/loader.gif";
const Logo =  "/images/chatbot.png";

export default function page() {

  const [values, setValues] = useState({
    email: "",
    password: "",
    confirm_password: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const toastOptions = {
    position: "bottom-right",
    autoClose: 3000,
    pauseOnHover: true,
    closeOnClick: true,
    draggable: true,
    theme: "dark",
  };

  const router = useRouter();
  
  useEffect(() => {
    if (localStorage.getItem("chatbot-user")) {
      router.push("/");
    }
  }, []);

  const handleValidation = () => {
    const {  email, password, confirm_password } = values;
    if (email.length < 3) {
      toast.error("Email must be at least 5 characters long", toastOptions);
      return false;
    } else if (password.length < 3) {
      toast.error("Password must be at least 6 characters long", toastOptions);
      return false;
    } else if (password !== confirm_password) {
      toast.error("Password and confirm password must be same", toastOptions);
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    setIsLoading(true);
    e.preventDefault();
    console.log("signup data " , values)

    if (handleValidation()) {
      const { email ,password } = values;
      try {
        const { data } = await axios.post("/users/signup", {
          first_name: "abc",
          last_name: "xyz",
          email : email,
          password: password,
        });

        console.log("response singup :",data)

        if (data){
          localStorage.setItem("chatbot-user", JSON.stringify(data));
          router.push("/");
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
        <form onSubmit={(e) => handleSubmit(e)} className="bg-[#00000076] rounded-xl p-12 flex flex-col justify-center items-center">
          <div className="flex justify-center items-center gap-4">
            <img src={Logo} alt="Logo Image" className="h-20" />
          </div>

          <input
            type="text"
            placeholder="Email"
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
          <input
            type="password"
            placeholder="Confirm Password"
            name="confirm_password"
            onChange={(e) => handleChange(e)}
            className="bg-transparent py-2 border-[0.1rem] border-[#4e0eff] flex flex-col rounded-md text-white text-base my-4 w-full focus:border-[#997af0] focus:outline-none"
          />

          <button type="submit" className="bg-[#4e0eff] text-white py-2 px-8 border-none w-full font-bold cursor-pointer rounded-md text-base uppercase transition-colors duration-500 ease-in-out hover:bg-[#997af0]">Create User</button>

          <span className="text-white uppercase block text-center mt-4">
            Already have an account? <Link href="/auth/login" className="text-[#4e0eff] no-underline font-bold">&nbsp; Login</Link>
          </span>

        </form>
      </div>)}
      <ToastContainer />
    </>
  );
}

