"use client"
import Image from "next/image";
import { useEffect, useState } from "react";
import io, { Socket } from "socket.io-client";


const SOCKET_SERVER_END_POINT = "https://realtime-demo-server.onrender.com"

export default function Home() {

  const [socket, setSocket] = useState<Socket | null>(null)
  const [message, setMessage] = useState("")
  const [messages, setMessges] = useState<any>([])


  useEffect(() => {
    const newSocket = io(SOCKET_SERVER_END_POINT);
    setSocket(newSocket)
    return () => {
      setSocket(null)
    }
  }, [])

  useEffect(() => {
    if (socket) {
      socket.on("message-received", (message) => {
        console.log("new message received");
        setMessges((prevMessages: any) => [...prevMessages, message])
      })
    }


    return ()=>{
      socket?.off("message-received")
    }

  }, [socket])

  const sendMessage = () => {
    socket?.emit("send-message", message)
    setMessage("")
  }

  return (
    <div className="container  mx-auto min-h-screen ">
      <div className="flex flex-col h-full">
        <h1 className="text-3xl font-bold">Chat App</h1>

        <div className="flex flex-col gap-6">
          {
            messages.map((message: any , index : number) => (
              <div key={index} className="bg-gray-300 rounded-md p-4">
                {message}
              </div>
            ))
          }

        </div>

        <div>
          <input value={message} className="border-gray-500 border outline-none" type="text" onChange={(e) => setMessage(e.target.value)} />
          <button onClick={sendMessage} className="bg-green-700 text-white font-bold px-4 py-3 rounded-md">Send Message</button>
        </div>

      </div>
    </div>
  );
}
