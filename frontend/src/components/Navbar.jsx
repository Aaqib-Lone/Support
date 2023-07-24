import React from 'react'
import { useNavigate } from 'react-router-dom';
import { FiLogOut } from 'react-icons/fi';
import { UserContext } from '../contexts/UserContext';
import { useContext } from 'react';
import axios from 'axios';
export const Navbar = () => {
    const navigate = useNavigate();
    const { currUser } = useContext(UserContext);
    const user = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null;
    const flushReq = async () => {
        try {
            const res = await axios.post("http://localhost:5000/api/v1/support/deleteAll", { email: currUser.email }, {
                headers: {
                    Authorization: `Bearer ${user.token}`
                }
            });
        } catch (e) {
            console.log(e);
        }

    }
    const setOnlineStatus = async (isonline) => {
        try {
            const res = await axios.put("http://localhost:5000/api/v1/users/setOnlineStatus", { email: currUser.email, isonline: isonline }, {
                headers: {
                    Authorization: `Bearer ${user.token}`
                }
            });
        } catch (e) {
            console.log(e);
        }

    }


    return (
        <>
            {
                user && user.designation && <>
                    <div className='fixed w-screen h-[4rem]  bg-[#28282B] flex  items-center justify-between'>
                        <text className=' font-mono text-white  text-xl m-[2rem]'>
                            HelpDesk
                        </text>
                        {
                            currUser.designation === '2' && <>
                                <div className='text-white flex flex-row w-[20%]  justify-around font-mono'>
                                    <button onClick={() => {
                                        navigate('/admin')
                                    }}>
                                        home
                                    </button>
                                    <button onClick={() => {
                                        navigate('/logs')
                                    }}>
                                        Logs
                                    </button>
                                    <button onClick={() => {
                                        navigate('/registersupport')
                                    }}>
                                        Add User
                                    </button>
                                </div>
                            </>
                        }

                        <FiLogOut onClick={() => {
                            localStorage.removeItem('user');
                            if (currUser.designation === '0') {
                                flushReq();
                            }

                            setOnlineStatus('0');
                            window.location = `${window.location.origin}/authentication`;
                        }} className='  text-white text-3xl m-[2rem]' >
                        </FiLogOut>
                    </div>
                </>
            }
        </>
    )
}
