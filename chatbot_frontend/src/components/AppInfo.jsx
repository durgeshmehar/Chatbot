import React,{useState, useEffect } from "react";
const Logo = "/images/chatbot.png";
import { FaTimes } from "react-icons/fa";

import { useRouter } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRightFromBracket } from "@fortawesome/free-solid-svg-icons";

export default function AppInfo({errorMsg , handleError}) {
  const [curruser , setCurruser] = useState(null)
  const router = useRouter();

  useEffect(()=>{
    const user = JSON.parse(localStorage.getItem("chatbot-user")) ;
    if(user){
      setCurruser(user)
    }
  }, [])

  
  const handleLogout = ()=>{
    if(curruser){
      localStorage.removeItem("chatbot-user");
      setCurruser(null)
      router.push("/auth/login")
    }
  }

  return (
    <main  className="flex flex-col p-1" >

        <div className="w-full flex justify-between items-center px-8 md:px-4 p-4 py-2 ">

          <div className="flex justify-start items-center gap-2 w-full">
            <img
              src={Logo}
              alt="Logo Image"
              className="h-16 w-16 rounded-[50%]"
            />
            <p className=" font-semibold">ChatBot</p>
          </div>

          <div className="icon">
            <FontAwesomeIcon
              icon={faRightFromBracket}
              className="logoutIcon h-6 cursor-pointer "
              onClick ={handleLogout}
            />
          </div>
        </div>

        <div className="hidden md:flex flex-col justify-center items-center mt-[25vh]">
          <p className="text-green-500 text-xl p-4 text-center font-bold"> Welcome to our chatbot! </p>

          <p className="p-4 text-center tracking-normal">
            Our intelligent assistant is here to help you with any questions or
            inquiries you may have.
          </p>
        </div>
        {errorMsg? 
        <div className="w-full box-border errors border p-2 relative mt-5 text-red-600">
        <FaTimes className="absolute -top-2 right-0 w-6 h-6 p-1 bg-gray-300 text-red-800 border rounded-full border-red-800 hover:bg-gray-500 cursor-pointer" onClick={()=>{handleError(null)} } />
          {errorMsg}
        </div> : null}
        


    </main>
  );
}
