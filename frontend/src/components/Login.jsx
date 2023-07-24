import React from 'react'
import { useState } from 'react';
import { useNavigate } from "react-router-dom"
import { useContext } from 'react';
import { UserContext } from '../contexts/UserContext';
import axios from "axios";
const Login = (props) => {
    const { settoggle } = props;
    const naviagte = useNavigate();
    const [data, setdata] = useState({ email: "", password: "" });
    const { currUser, setcurrUser } = useContext(UserContext);



    const handleLogin = async (data) => {
        try {
            const res1 = await axios.post("http://localhost:5000/api/v1/users/getUserByAuth", data);
            if (res1.data.token) {
                localStorage.setItem('user', JSON.stringify(res1.data));

                const res2 = await axios.get("http://localhost:5000/api/v1/users/getCurrUser", {
                    headers: {
                        Authorization: `Bearer ${res1.data.token}`
                    }
                });
                setcurrUser(res2.data);

                await axios.put("http://localhost:5000/api/v1/users/setOnlineStatus", { email: res2.data.email, isonline: '1' }, {
                    headers: {
                        Authorization: `Bearer ${res1.data.token}`
                    }
                });
                if (res2 && res2.data.designation === '0') {
                    window.location = `${window.location.origin}/user`;
                } else if (res2 && res2.data.designation === '1') {
                    window.location = `${window.location.origin}/usersupport`;
                } else {
                    window.location = `${window.location.origin}/admin`;
                }


            } else {
                alert("Invalid credentials!!");
            }

        } catch (e) {
            console.log(e);
        }
    }

    return (
        <>

            <div class="bg-gray-50 h-screen flex items-center justify-center bg-gradient-to-r from-purple-800 via-violet-900 to-purple-800 ">
                {/* <!-- login container --> */}
                <div class="bg-gray-100 flex rounded-2xl shadow-lg max-w-3xl p-6 items-center">
                    {/* <!-- form --> */}
                    <div class="md:w-1/2 px-8 md:px-16">
                        <h2 class="font-bold text-3xl text-[#002D74]">Login</h2>
                        <p class="text-xs mt-4 text-[#002D74]">If you are already a member, easily log in</p>

                        <div class="flex flex-col gap-4">
                            <input class="p-2 mt-8 rounded-xl border" type="email" name="email" placeholder="Email" onChange={(e) => {
                                setdata({ ...data, email: e.target.value })
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
                            <button class="bg-[#002D74] rounded-xl text-white py-2 hover:scale-105 duration-300" onClick={() => {
                                console.log("clicked")
                                handleLogin(data);

                            }}>Login</button>
                        </div>
                        <div class="mt-3 text-xs flex justify-between items-center text-[#002D74]">
                            <p>Don't have an account?</p>
                            <button class="py-2 px-5 bg-white border rounded-xl hover:scale-110 duration-300" onClick={() => { settoggle(0) }}>Register</button>
                        </div>
                    </div>

                    {/* <!-- image --> */}
                    <div class="md:block hidden w-1/2">
                        <img class="rounded-2xl" src='https://cdni.iconscout.com/illustration/premium/thumb/login-3305943-2757111.png' />
                    </div>
                </div>
            </div>



        </>
    )
}

export default Login;