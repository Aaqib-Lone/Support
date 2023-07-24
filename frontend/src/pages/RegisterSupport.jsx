import React from 'react'
import { useNavigate } from "react-router-dom"
import { useState } from 'react';
import axios from 'axios';
const RegisterSupport = () => {
    const [data, setdata] = useState({ name: "", username: "", email: "", password: "", phone_no: "", profile_image: "" });
    const convertBase64 = (file) => {
        return new Promise((resolve, reject) => {
            const fileReader = new FileReader();
            fileReader.readAsDataURL(file)
            fileReader.onload = () => {
                resolve(fileReader.result);
            }
            fileReader.onerror = (error) => {
                reject(error);
            }
        })
    }
    const handleRegister = async (data) => {
        try {
            const res = await axios.post("http://localhost:5000/api/v1/users/addUser", { ...data, designation: '1' });
            if (res.status == 200) {
                alert("Registration Successful!");

            } else {
                alert("Registration Failed Please try again!")
            }
        } catch (e) {
            console.log(e);
        }
    }
    return (
        <>
            <>

                <div class="bg-gray-50 h-screen flex items-center justify-center bg-gradient-to-r from-purple-800 via-violet-900 to-purple-800 ">
                    {/* <!-- login container --> */}
                    <div class="bg-gray-100 flex rounded-2xl shadow-lg max-w-3xl p-[3rem] items-center">
                        {/* <!-- form --> */}
                        <div class="md:w-1/2 px-8 md:px-16">
                            <h2 class="font-bold text-2xl text-[#002D74] w-[100%]">Register customer Support</h2>

                            <div class="flex flex-col gap-4">
                                <input class="p-2 mt-8 rounded-xl border" type="text" name="name" placeholder="Name" onChange={(e) => {
                                    setdata({ ...data, name: e.target.value })
                                }} />
                                <input class="p-2  rounded-xl border" type="text" name="username" placeholder="Username" onChange={(e) => {
                                    setdata({ ...data, username: e.target.value })
                                }} />
                                <input class="p-2  rounded-xl border" type="email" name="email" placeholder="Email" onChange={(e) => {
                                    setdata({ ...data, email: e.target.value })
                                }} />
                                <input class="p-2  rounded-xl border" type="tel" name="phone_no" placeholder="Phone No." onChange={(e) => {
                                    setdata({ ...data, phone_no: e.target.value })
                                }} />
                                <div class="relative">
                                    <input class="p-2 rounded-xl border w-full" type="password" name="password" placeholder="Password" onChange={(e) => {
                                        setdata({ ...data, password: e.target.value })
                                    }} />
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="gray" class="bi bi-eye absolute top-1/2 right-3 -translate-y-1/2" viewBox="0 0 16 16">
                                        <path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8zM1.173 8a13.133 13.133 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13.133 13.133 0 0 1 14.828 8c-.058.087-.122.183-.195.288-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5c-2.12 0-3.879-1.168-5.168-2.457A13.134 13.134 0 0 1 1.172 8z" />
                                        <path d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5zM4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0z" />
                                    </svg>
                                </div>
                                {/* <label class="block">    *Logic for storing Profile Image not integrated.*
                                    <span class="sr-only">Choose profile photo</span>
                                    <input type="file" class="block w-full text-sm text-gray-500
      file:mr-4 file:py-2 file:px-4
      file:rounded-md file:border-0
      file:text-sm file:font-semibold
      file:bg-blue-500 file:text-white
      hover:file:bg-blue-600
    "     onChange={async (e) => {
                                            const file = e.target.files[0]
                                            const base64 = await convertBase64(file);
                                            setdata({ ...data, profile_image: base64 });


                                        }} accept="image/*" // Optional: Specify the accepted file types
                                        capture="environment" />
                                </label> */}

                                <button class="bg-[#002D74] rounded-xl text-white py-2 hover:scale-105 duration-300" onClick={() => {
                                    handleRegister(data);
                                }}>Register</button>
                            </div>

                        </div>

                        {/* <!-- image --> */}
                        <div class="md:block hidden w-1/2">
                            <img class="rounded-2xl" src='https://cdni.iconscout.com/illustration/premium/thumb/login-3305943-2757111.png' />
                        </div>
                    </div>
                </div>



            </>

        </>
    )
}

export default RegisterSupport