import React, { useEffect, useState, useRef, useContext } from 'react'
import axios from 'axios'
import Chatbot from './Chatbot/Chatbot'
import { VideoCallContext } from '../contexts/VideoCallContext'
import Peer from "simple-peer"
import { UserContext } from '../contexts/UserContext'
import { Routes, Route, Navigate, useLocation, useNavigate } from "react-router-dom";
const Admin = (props) => {
    let { socket } = props;
    const location = useLocation();
    const navigate = useNavigate();
    const [questions, setQuestions] = useState([]);
    const [onlineUsers, setonlineUsers] = useState(0);
    const [onlineSupport, setonlineSupport] = useState(0);

    const { currUser, setcurrUser } = useContext(UserContext);
    const [newQuestion, setnewQuestion] = useState({ question: "", answer: "" });
    const user = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null;
    const fetchOnlineUsers = async () => {
        try {
            const res1 = await axios.get("http://localhost:5000/api/v1/users/onlineUsers", {
                headers: {
                    Authorization: `Bearer ${user.token}`
                }
            });
            const res2 = await axios.get("http://localhost:5000/api/v1/users/onlineCustomerSupport", {
                headers: {
                    Authorization: `Bearer ${user.token}`
                }
            });
            setonlineUsers(res1.data);
            setonlineSupport(res2.data);

        } catch (e) {
            console.log(e);
        }

    }


    const fetchUser = async () => {
        try {
            const res = await axios.get("http://localhost:5000/api/v1/users/getCurrUser", {
                headers: {
                    Authorization: `Bearer ${user.token}`
                }
            });
            console.log(res.data);

            setcurrUser(res.data);
        } catch (e) {
            console.log(e);
        }
    }
    const fetchQuestionData = async () => {
        try {
            const res = await axios.get("http://localhost:5000/api/v1/questions/getQuestions", {
                headers: {
                    Authorization: `Bearer ${user.token}`
                }
            });
            console.log("question fetched !");

            setQuestions(res.data);
        } catch (e) {
            console.log(e);
        }
    }
    const addQuestion = async (newQuestion) => {
        try {
            const res = await axios.post("http://localhost:5000/api/v1/questions/addQuestion", newQuestion, {
                headers: {
                    Authorization: `Bearer ${user.token}`
                }
            });
            fetchQuestionData();
        } catch (e) {

            console.log(e);
        }
    }
    const handleAdd = () => {
        if (newQuestion.question != '' && newQuestion.answer != '') {
            // console.log(newQuestion)
            addQuestion(newQuestion);

        } else {
            alert("Please enter the complete data!");
        }

    }


    useEffect(() => {

        fetchQuestionData();
    }, []);

    useEffect(() => {

        fetchUser();
        fetchOnlineUsers();
    }, [])





    return (
        <>
            {user && user.designation && <>

                <div className='w-screen min-h-screen  bg-gradient-to-r from-purple-800 via-violet-900 to-purple-800'>
                    <div className=' items-center md:items-start  flex justify-center flex-col md:flex-row'>
                        <div className='rounded-xl w-[90vh] md:w-[25%] m-[3px]   bg-gray-100  p-[2rem] flex-col flex  items-center  mt-[5rem] '>

                            <img class="flex-shrink-0 h-[8rem] w-[8rem] rounded-full bg-gray-300" src='https://upload.wikimedia.org/wikipedia/commons/thumb/2/2c/Default_pfp.svg/1200px-Default_pfp.svg.png' />

                            <div class="grid grid-cols-2 gap-2 w-[100%] place-items-center text-xl  font-mono mt-[2rem]">
                                <div className='font-bold'>Name:</div>

                                <div>{currUser.name}</div>
                                <div className='font-bold'>Username:</div>

                                <div>{currUser.username}</div>
                                <div className='font-bold'>Email:</div>

                                <div>{currUser.email}</div>
                                <div className='font-bold'>Phone Number:</div>

                                <div>{currUser.phone_no}</div>
                            </div>
                        </div>
                        <div className='rounded-xl   mt-[5rem] flex w-[90vh] md:w-[45%]  bg-gray-100 m-[3px]  min-h-[40rem] p-[1rem] items-center flex-col'>
                            <h1 className=' text-3xl  font-mono font-bold mb-[2rem]'>
                                Predefined Questions
                            </h1>
                            <div className='flex flex-row items-center justify-center w-[100%]'>
                                <text className='font-mono font-bold text-lg mb-[1rem]'>
                                    Question:
                                </text>
                                <div class="relative border border-black rounded w-full mb-[1rem]" data-te-input-wrapper-init>
                                    <input
                                        type="text"
                                        class="peer block min-h-[auto] w-full rounded border-0 bg-transparent px-3 py-[0.32rem] leading-[1.6] outline-none transition-all duration-200 ease-linear focus:placeholder:opacity-100 peer-focus:text-primary data-[te-input-state-active]:placeholder:opacity-100 motion-reduce:transition-none dark:text-neutral-200 dark:placeholder:text-neutral-200 dark:peer-focus:text-primary [&:not([data-te-input-placeholder-active])]:placeholder:opacity-0"
                                        id="exampleFormControlInputText"
                                        placeholder="Example label" onChange={(e) => {
                                            setnewQuestion({ ...newQuestion, question: e.target.value })
                                        }} />
                                    <label
                                        for="exampleFormControlInputText"
                                        class="pointer-events-none absolute left-3 top-0 mb-0 max-w-[90%] origin-[0_0] truncate pt-[0.37rem] leading-[1.6] text-neutral-500 transition-all duration-200 ease-out peer-focus:-translate-y-[0.9rem] peer-focus:scale-[0.8] peer-focus:text-primary peer-data-[te-input-state-active]:-translate-y-[0.9rem] peer-data-[te-input-state-active]:scale-[0.8] motion-reduce:transition-none dark:text-neutral-200 dark:peer-focus:text-primary"
                                    >
                                    </label>
                                </div>
                            </div>
                            <div class="relative border border-black rounded w-full" data-te-input-wrapper-init>
                                <textarea
                                    class="peer block min-h-[auto] w-full rounded border-0 bg-transparent px-3 py-[0.32rem] leading-[1.6] outline-none transition-all duration-200 ease-linear focus:placeholder:opacity-100 peer-focus:text-primary data-[te-input-state-active]:placeholder:opacity-100 motion-reduce:transition-none dark:text-neutral-200 dark:placeholder:text-neutral-200 dark:peer-focus:text-primary [&:not([data-te-input-placeholder-active])]:placeholder:opacity-0"
                                    id="exampleFormControlTextarea1"
                                    rows="4"
                                    maxLength="150"
                                    placeholder="Your message" onChange={(e) => {
                                        setnewQuestion({ ...newQuestion, answer: e.target.value })
                                    }}></textarea>

                            </div>
                            <button className='bg-red-400 text-gray-50 min-w-[5rem] rounded-md p-[10px] m-[1rem]' onClick={() => {
                                handleAdd();
                            }}>
                                Add
                            </button>


                            {
                                questions.map((x) => {
                                    return <>
                                        <div className=' border border-black rounded mb-[1rem] w-[100%] '>
                                            <h1 class="bg-gray-300 p-3 w-[100%]  border border-black p-[1rem]" >
                                                {x.question}
                                            </h1 >
                                            <div id={x.q_id} className=' min-h-[5rem] p-[1rem]'>
                                                {x.answer}

                                            </div>
                                        </div>


                                    </>
                                })
                            }





                        </div>
                        <div className='rounded-xl flex items-center w-[90vh] md:w-[25%]  bg-gray-100 h  m-[3px] min-h-[13rem]    mt-[5rem]  p-[1rem] flex-col'>
                            <h1 className='text-3xl  font-mono font-bold'>Current Traffic</h1>
                            <div class="grid grid-cols-2 gap-2 w-[100%] place-items-center text-xl  font-mono mt-[2rem]">
                                <div className='font-bold'>Users:</div>

                                <div>{onlineUsers}</div>
                                <div className='font-bold'>Support:</div>

                                <div>{onlineSupport}</div>

                            </div>


                        </div>
                    </div>
                </div >




            </>}
        </>
    )
}

export default Admin