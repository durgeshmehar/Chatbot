"use client";
import { useEffect , useState} from "react";
import AppInfo from "@/components/AppInfo";
import Chatbox from "@/components/Chatbox";
import { useRouter } from "next/navigation";


export default function Home() {
  const router = useRouter();
  const [errorMsg , setErrorMsg] = useState(null)

  useEffect(() => {
    if (!localStorage.getItem("chatbot-user")) {
      router.push("/auth/login");
    }
  }, []);

  const handleError =(errorText)=>{
       setErrorMsg(errorText)
  }

  return (
   
      <div className="container1 grid grid-cols-5 h-screen w-screen">

        <div className="col-span-5 md:col-span-2 lg:col-span-1 bg-zinc-900 text-white">
          <AppInfo errorMsg={errorMsg} handleError={handleError} />
        </div>

        <div  className="col-span-5 md:col-span-3 lg:col-span-4 bg-zinc-800" >
          <Chatbox handleError={handleError} />
        </div>
        
      </div>
  );
}
