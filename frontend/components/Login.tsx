import React from 'react';
import image from './image.png';
//import { useNavigate } from "react-router-dom";

const Login: React.FC = () => {

    const goToLogin = () => {
        //navigate('/');
    };


    return (
        <div className="bg-green-150 flex justify-center items-center h-screen w-screen">
            <div className="flex flex-row items-center bg-transparent h-3/4 w-4/5">
                <div className="bg-green-350 flex flex-col justify-between h-full w-1/3 shadow-2xl">
                    <h1 className="text-3xl font-bold pl-4 pt-4"> Angel Trading Co. </h1>
                    <img src = { image } alt = "img" className = "h-4/5 w-11/12 pl-4"></img>

                    <div className="flex flex-col justify-end items-center w-full">
                        <p className="text-gray-800 text-l p-4 text-center"> The premier Smiski trading platform. </p>
                    </div>
                </div>

                <div className="bg-yellow-350 flex justify-center items-center relative h-full w-2/3 shadow-2xl">
                    
                    <div className="absolute top-4 right-32"> 
                        <p className = "text-s"> Already have an account? </p>
                    </div>
                    <div className="absolute top-4 right-4 "> 
                        <button className="flex justify-center items-center text-s hover:scale-110 h-6 w-24 px-4 py-1 bg-green-350 text-black rounded-lg transition duration-300 ease-in-out hover:bg-green-450 outline outline-green-450 outline-3" onClick={goToLogin}>
                        Sign in
                        </button>
                    </div>

                    <div className="flex flex-col h-3/5 pr-40">
                        <h1 className="text-4xl font-bold"> Welcome to </h1>
                        <h1 className="text-4xl font-bold"> Angel Trading Co.! </h1>
                        <h3 className = "text-lg font-bold pt-6"> Please register your account. </h3>

                        <div className = "flex flex-col justify-between h-2/5 pt-12">
                            <p className = ""> Username </p>
                            <label>
                                <input name = "Username" className = "bg-gray-200 w-96 rounded-lg"/>
                            </label>

                            <p className = "pt-4"> Email Address </p>
                            <label>
                                <input name = "Email" className = "bg-gray-200 w-96 rounded-lg"/>
                            </label>

                            <p className = "pt-4"> Password </p>
                            <label>
                                <input name = "Password" className = "bg-gray-200 w-96 rounded-lg"/>
                            </label>

                            <div className="flex justify-center mt-6"> 
                                <button className="hover:scale-110 w-32 bg-green-350 text-black py-2 px-4 rounded-lg transition duration-300 ease-in-out hover:bg-green-450 outline outline-green-450 outline-3" onClick={goToLogin}>
                                    Register
                                </button>
                            </div>

                        </div>
                    </div>         
                </div>
            </div>
        </div>
    );
};

export default Login;
