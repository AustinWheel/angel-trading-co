//@ts-nocheck
import { send } from 'process';
import { React, useEffect, useState } from 'react';
import io from 'socket.io-client';
const socket = io.connect('http://localhost:3001');

const Chat: React.FC = () => {
    const [messages, setMessages] = useState([]);
    const [messageText, setMessageText] = useState(""); // possibly turn into length 2 array [text, "me" or "other"]?
    const [room, setRoom] = useState("");

    const joinRoom = () => {
        if (room !== "") 
        {
            socket.emit("join_room", room);
        }
    }

    const sendMessage = () => {
        const newMessage = { text: messageText, isOutgoing: true, room: room };
        setMessages((prevMessages) => [...prevMessages, newMessage]);
        socket.emit("send_msg", { messageText, room });
        setMessageText("");
    };
    
    const receiveMessage = (message) => {
        const incomingMessage = { ...message, isOutgoing: false };
        setMessages((prevMessages) => [...prevMessages, incomingMessage]);
    };
    useEffect(() => {
        socket.on("receive_msg", receiveMessage);

        return () => {
            socket.off("receive_msg", receiveMessage);
        };
    }, []);

    return (
        <div className = "bg-yellow-200 w-96 h-screen flex flex-col">
            {/* Top border with username and buttons */}
            <div className="flex-grow overflow-auto">
                <div className="bg-gray-200 w-full flex flex-row items-center text-black justify-between">
                    <button className="text-m bg-transparent"> &lt; Back </button>
                    <h2 className="text-xl"> Dr. Epstein </h2>
                    <button className="text-m bg-transparent"> Requests </button>
                </div>

                {/* Main chat area with messages */}
                <div className="messages flex flex-col">
                    {messages.map((message, index) => (
                        <div key={index} className={`message m-2 p-2 rounded inline-block max-w-xs break-words ${message.isOutgoing ? 'self-end bg-green-150' : 'self-start bg-gray-200 '}`}>
                            {message.text}
                        </div>
                    ))}
                </div>

            </div>

            <div className="flex flex-col space-y-2 p-2">
                <div className="flex items-center">
                    {/* Temporary room input for testing purposes, will be replaced later */}
                    <input 
                        placeholder='Type a room number...' 
                        onChange={(event) => {setRoom(event.target.value)}} 
                        className="flex-grow bg-gray-200 p-2 rounded-lg rounded-r-none"
                    />
                    <button onClick={joinRoom} className="bg-green-150 p-2 rounded-lg rounded-l-none hover:bg-green-250 active:bg-green-350"> Join </button>
                </div>
                <div className="flex items-center">
                    <input 
                        placeholder='Type a message...' 
                        value = {messageText}
                        onChange={(event) => {setMessageText(event.target.value)}} 
                        onKeyDown={(event) => {
                            if (event.key === "Enter" && messageText !== "") {
                                sendMessage();
                                event.preventDefault(); 
                            }
                        }}
                        className="flex-grow bg-gray-200 p-2 rounded-lg rounded-r-none"
                    />
                    {
                        messageText !== "" ?
                        <button onClick={sendMessage} className="bg-green-150 p-2 rounded-lg rounded-l-none hover:bg-green-250 active:bg-green-350 "> Send </button>
                        :
                        <button className="bg-gray-100 p-2 rounded-lg rounded-l-none "> Send </button>
                    }
                </div>
            </div>
        </div>
    );
};

export default Chat;