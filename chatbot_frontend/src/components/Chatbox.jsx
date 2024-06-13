import { FaArrowUp, FaPlus, FaFilePdf } from "react-icons/fa";
import { FaTimes } from "react-icons/fa";
import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { dracula } from "react-syntax-highlighter/dist/esm/styles/prism";
import { BACKEND_URL } from "@/components/constant";

function CodeBlock({ node, inline, className, children, ...props }) {
  const match = /language-(\w+)/.exec(className || "");
  const lang = match ? match[1] : "javascript";
  return !inline && match ? (
    <SyntaxHighlighter language={lang} style={dracula} {...props}>
      {String(children).replace(/\n$/, "")}
    </SyntaxHighlighter>
  ) : (
    <code className="p-[2px] bg-gray-400 rounded" {...props}>
      {children}
    </code>
  );
}

export default function Chatbox({handleError}) {
  const Logo = "/images/chatbot.png";
  const dotLoader = "/images/dot.gif";
  const loadingBar = "/images/loading.gif";
  const userLogo = "/images/boy.png";
  const [chatpresent, setChatpresent] = useState(false);
  const router = useRouter();
  const [messages, setMessages] = useState([]);
  const [inputmsg, setInputmsg] = useState({ show: false, msg: "" });
  const [newmsg, setNewmsg] = useState("");
  const inputRef = useRef();
  const newRef = useRef();
  const endOfMessagesRef = useRef(null);
  const [uploadedFile, setUploadedFile] = useState(null);
  const fileInputRef = useRef();
  const [showloading, setShowloading] = useState(false);

  useEffect(() => {
    const fetchChats = async () => {
      const userData = JSON.parse(localStorage.getItem("chatbot-user"));
      if (userData) {
        const token = userData.access_token;
        const response = await axios.get(`${BACKEND_URL}/chats/chat`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response && response.data) {
          setMessages(response.data);
          setChatpresent(true);
        }
      }
    };

    fetchChats();
  }, []);

  useEffect(() => {
    if (endOfMessagesRef.current) {
      endOfMessagesRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  useEffect(() => {
    if (newRef.current) {
      newRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [newmsg, inputmsg.show]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const userEntermsg = inputmsg.msg;
    setNewmsg(userEntermsg);
    setInputmsg({ ...inputmsg, show: true });
    setInputmsg({ show: true, msg: "" });
    const userData = JSON.parse(localStorage.getItem("chatbot-user"));

    if (!userData) {
      router.push("/auth/login");
    } else {
      const token = userData.access_token;
      let sendRoute ="";
      let contentType = "";

      if(uploadedFile){
        sendRoute="pdf/answer"
        contentType = 'application/x-www-form-urlencoded'
      }
      else{ 
        sendRoute="chats/chat"
        contentType = 'application/json'
      }

      const sendData = async () => {
        try {
          const response = await axios.post(
            `${BACKEND_URL}/${sendRoute}`,
            { message: userEntermsg },
            { headers: { 
              Authorization: `Bearer ${token}` ,
              'Content-Type': `${contentType}`
            } }
          );
          console.log("Console Response :", response)

          if (response && response.data) {
            
            const sendReceiveData = {
                ...response.data,
                user_message: userEntermsg,
              };
            setMessages((prevMessages) => [...prevMessages, sendReceiveData]);
            setInputmsg({ show: false, msg: "" });
            setNewmsg("");
          }
        } catch (error) {
          if (error.response && error.response.status === 422) {
            console.error('Validation error', error.response.data);
          } else {
            console.error('Error', error.message);
          }
        }
      };
      sendData();
    }
  };

  const handleFileUpload = async (event) => {
    setShowloading(true);
    const file = event.target.files[0];
    const formData = new FormData();
    formData.append("file", file);

    const userData = JSON.parse(localStorage.getItem("chatbot-user"));
    if (userData) {
      const token = userData.access_token;
      try {
        const response = await axios.post(`${BACKEND_URL}/pdf/upload`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.status === 200) {
          console.log("File uploaded successfully:", response.data.filename);
          setUploadedFile(response.data.filename);
        } else {
          console.log("Error uploading file:", response);
        }
      } catch (error) {
        handleError(error.response.data.message);
        console.error("Error uploading file:", error.response.data.message);
      }
    }
    setShowloading(false);
  };

  const handleButtonClick = () => {
    fileInputRef.current.click();
  };

  const handleRemovePdf= () =>{
    setUploadedFile(null);
  }

  return (
    <main className="w-full">
      <div className="min-h-[90vh]">
        {!chatpresent ? (
          <div className="brand flex flex-col justify-center items-center gap-4 h-[90vh]">
            <img
              src={Logo}
              alt="Logo Image"
              className="h-16 w-16 rounded-[50%]"
            />
            <h1 className="text-white text-2xl font-semibold">
              How can I help you today?
            </h1>
          </div>
        ) : (
          <div className="chat-message px-[1vw] md:px-[8vw] mb-4 max-h-[80vh] md:max-h-[90vh] overflow-y-auto">
            {messages.map((msg, index) => (
              <div key={index} className="flex flex-col m-4">
                <div className="self-start md:self-end w-[100%] lg:w-[60%]">
                  <div className="brand flex justify-start items-center gap-2">
                    <img
                      src={userLogo}
                      alt="Logo Image"
                      className="h-10 w-10 rounded-[50%]"
                    />
                    <h1 className="text-white text-lg font-semibold">You</h1>
                  </div>
                  <div className="p-3 rounded-full break-words text-sm lg:text-base text-white">
                    <p>{msg.user_message}</p>
                  </div>
                </div>
                <div className="self-start w-[100%] lg:w-[60%]">
                  <div className="brand flex justify-start items-center gap-2">
                    <img
                      src={Logo}
                      alt="Logo Image"
                      className="h-10 w-10 rounded-[50%]"
                    />
                    <h1 className="text-white text-lg font-semibold">
                      Chatbot
                    </h1>
                  </div>
                  <div className="p-3 rounded-full break-words text-sm lg:text-base leading-relaxed">
                    <ReactMarkdown
                      children={msg.ai_message}
                      className="w-[100%] leading-relaxed"
                      components={{ code: CodeBlock }}
                    />
                  </div>
                </div>
                {index === messages.length - 1 && (
                  <div ref={endOfMessagesRef} />
                )}
              </div>
            ))}
            <div ref={newRef}>
              {inputmsg.show && (
                <div className="flex flex-col m-4">
                  <div className="self-start md:self-end w-[100%] lg:w-[60%]">
                    <div className="brand flex justify-start items-center gap-2">
                      <img
                        src={userLogo}
                        alt="Logo Image"
                        className="h-10 w-10 rounded-[50%]"
                      />
                      <h1 className="text-white text-lg font-semibold">You</h1>
                    </div>
                    <div className="p-3 rounded-full break-words text-sm lg:text-base text-white">
                      <p>{newmsg}</p>
                    </div>
                  </div>
                  <div className="self-start w-[100%] lg:w-[60%]">
                    <div className="brand flex justify-start items-center gap-2">
                      <img
                        src={Logo}
                        alt="Logo Image"
                        className="h-10 w-10 rounded-[50%]"
                      />
                      <h1 className="text-white text-lg font-semibold">
                        Chatbot
                      </h1>
                    </div>
                    <div className="px-3 rounded-full break-words text-sm lg:text-base text-white">
                      <img src={dotLoader} className="ml-12 w-18 h-16 mt-0" />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
      <div className="chat-input flex justify-center items-center pb-6 h-[8vh]">
        <div className="w-full flex justify-center items-center gap-8 px-8">
          <form
            className="flex justify-between items-center rounded-lg border-none"
            onSubmit={handleSubmit}
          >
            <input
              ref={fileInputRef}
              type="file"
              style={{ display: "none" }}
              onChange={handleFileUpload}
            />
            {showloading ? (
              <img src={loadingBar} className="mr-4 w-8 h-8 mt-0" />
            ) : (
              uploadedFile && (
                <div className="relative p-3 rounded-full border mr-6 px-4">
                  <FaTimes className="absolute -top-2 right-0 w-6 h-6 p-[2px] bg-gray-300 text-red-800 border rounded-full border-red-800 hover:bg-gray-500 cursor-pointer" onClick={handleRemovePdf} />
                  <p>
                    <FaFilePdf className="inline p-1 w-8 h-8" />
                    {uploadedFile}
                  </p>
                </div>
              )
            )}
            <button
              type="button"
              onClick={handleButtonClick}
              className="p-1 mr-3 rounded-full border border-white hover:bg-white hover:text-black hover:border-transparent transition duration-300"
            >
              <FaPlus className="w-5 h-5"/>
            </button>
            <input
              ref={inputRef}
              type="text"
              placeholder="Type a message"
              value={inputmsg.msg}
              name="message"
              id="message"
              onChange={(e) =>
                setInputmsg({ show: false, msg: e.target.value })
              }
              className="h-12 rounded-lg w-[60vw] md:w-[40vw] border-none px-4 pr-12 bg-white bg-opacity-20 text-white bg-transparent focus:outline outline-gray-200"
            />
            <button
              type="submit"
              className={`relative right-[3rem] h-8 flex justify-center items-center px-2 m-2 mr-3 rounded-lg text-base cursor-pointer border-none ${
                inputmsg.msg.length > 0
                  ? "bg-gray-200 text-black"
                  : "bg-gray-500 text-gray-700"
              }`}
            >
              <FaArrowUp />
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
