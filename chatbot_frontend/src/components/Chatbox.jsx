import { FaArrowUp } from "react-icons/fa";
import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { prism } from "react-syntax-highlighter/dist/esm/styles/prism";
import { dracula } from "react-syntax-highlighter/dist/esm/styles/prism";
// import BACKEND_URL from "../components/constant"
import { BACKEND_URL } from "@/components/constant";
import { FaPlus, FaFilePdf } from "react-icons/fa";

function CodeBlock({ node, inline, className, children, ...props }) {
  const match = /language-(\w+)/.exec(className || "");
  let lang = "javascript";
  if (match) {
    lang = match[1];
  }
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

export default function Chatbox() {
  const Logo = "/images/chatbot.png";
  const dotLoader = "/images/dot.gif";
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

  useEffect(() => {
    const fetchChats = async () => {
      const userData = JSON.parse(localStorage.getItem("chatbot-user"));
      let token = "";
      if (userData) {
        token = userData.access_token;
        console.log("token passed :", token);

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

  const handleSubmit = (e) => {
    e.preventDefault();
    const userEntermsg = inputmsg.msg;
    setNewmsg(userEntermsg);
    setInputmsg({ ...inputmsg, show: true });
    setInputmsg({ show: true, msg: "" });

    const userData = JSON.parse(localStorage.getItem("chatbot-user"));
    let token = "";

    if (!userData) {
      router.push("/auth/login");
    } else {
      token = userData.access_token;

      const sendData = async () => {
        const response = await axios.post(
          `${BACKEND_URL}/chats/chat`,
          {
            message: userEntermsg,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (response && response.data) {
          const sendReceiveData = {
            ...response.data,
            user_message: userEntermsg,
          };
          setMessages([...messages, sendReceiveData]);
          setInputmsg({ show: false, msg: "" });
          setNewmsg("");
        }
      };
      sendData();
    }
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    const formData = new FormData();
    formData.append("file", file);

    const userData = await JSON.parse(localStorage.getItem("chatbot-user"));
    let token = "";
    if (userData) {
      token = userData.access_token;
    }

    const response = await axios.post(`${BACKEND_URL}/pdf/upload`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.file_batch_status === 200) {
      console.log("File uploaded successfully:", response.filename);
      setUploadedFile(response.filename);
    } else {
      console.log("Error to upload file:", response);
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current.click();
  };

  return (
    <main className="w-full">
      {!chatpresent ? (
        <div className="brand flex flex-col justify-center items-center gap-4 h-[90vh] ">
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
          {messages &&
            messages.length > 0 &&
            messages.map((msg, index) => {
              return (
                <div key={index} className="flex flex-col m-4">
                  <div className="self-start md:self-end  w-[100%]  lg:w-[60%] ">
                    <div className="brand flex justify-start items-center gap-2">
                      <img
                        src={userLogo}
                        alt="Logo Image"
                        className="h-10 w-10 rounded-[50%]"
                      />
                      <h1 className="text-white text-lg font-semibold">You</h1>
                    </div>

                    <div className=" p-3 rounded-full break-words text-sm lg:text-base text-white">
                      <p>{msg.user_message}</p>
                    </div>
                  </div>

                  <div className="self-start  w-[100%]  lg:w-[60%]">
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

                    <div className=" p-3 rounded-full break-words  text-sm lg:text-base leading-relaxed">
                      <ReactMarkdown
                        children={msg.ai_message}
                        className="w-[100%] leading-relaxed"
                        components={{
                          code: CodeBlock,
                        }}
                      />
                    </div>
                  </div>

                  {index === messages.length - 1 && (
                    <div ref={endOfMessagesRef} />
                  )}
                </div>
              );
            })}

          <div ref={newRef}>
            {inputmsg.show && (
              <div className="flex flex-col m-4">
                <div className="self-start md:self-end  w-[100%]  lg:w-[60%] ">
                  <div className="brand flex justify-start items-center gap-2">
                    <img
                      src={userLogo}
                      alt="Logo Image"
                      className="h-10 w-10 rounded-[50%]"
                    />
                    <h1 className="text-white text-lg font-semibold">You</h1>
                  </div>
                  <div className=" p-3 rounded-full break-words text-sm lg:text-base text-white">
                    <p>{newmsg}</p>
                  </div>
                </div>

                <div className="self-start  w-[100%]  lg:w-[60%]">
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

                  <div className=" px-3 rounded-full break-words  text-sm lg:text-base text-white">
                    <img src={dotLoader} className="ml-12 w-18 h-16 mt-0" />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      <div className="chat-input flex justify-center items-center pb-6 h-[8vh]">
        <div className="w-full flex justify-center items-center gap-8 px-8">
          <form
            className="flex justify-between items-center   rounded-lg border-none "
            onSubmit={handleSubmit}
          >
            {/* create here */}
            <input
              ref={fileInputRef}
              type="file"
              style={{ display: "none" }}
              onChange={handleFileUpload}
            />
            {uploadedFile && (
              <div className="p-2 rounded-full">
                <FaFilePdf />
                <p>{uploadedFile}</p>
              </div>
            )}
            <button onClick={handleButtonClick} className="p-1 mr-2 rounded-full border border-white">
              <FaPlus />
            </button>

            <input
              ref={inputRef}
              type="text"
              placeholder="Type a message"
              value={inputmsg.msg}
              onChange={(e) =>
                setInputmsg({ show: false, msg: e.target.value })
              }
              className=" h-12 rounded-lg w-[60vw] md:w-[40vw] border-none px-4 pr-12 bg-white bg-opacity-20 text-white bg-transparent focus:outline outline-gray-200"
            />
            <button
              type="submit"
              className={`relative right-[3rem] h-8 flex justify-center items-center px-2 m-2 mr-3 rounded-lg text-base cursor-pointer border-none ${
                inputmsg.msg.length > 0
                  ? "bg-gray-200 text-black"
                  : "bg-gray-500 text-gray-700"
              }`}
            >
              <FaArrowUp type="submit" />
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
