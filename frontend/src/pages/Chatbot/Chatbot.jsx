import React, { useContext, useEffect, useState } from 'react'
import Chatleft from './Chatleft'
import Chatright from './Chatright'
import Chatstart from './Chatstart';
import { BiBot } from 'react-icons/bi';
import { VideoCallContext } from '../../contexts/VideoCallContext';
import { ChatBotContext } from '../../contexts/ChatBotContext';
import { UserContext } from '../../contexts/UserContext';

import axios from 'axios';
import { Routes, Route, Navigate, useLocation, useNavigate } from "react-router-dom";
import Peer from 'simple-peer';
const Chatbot = (props) => {
    const { socket } = props;

    const [currentmsg, setCurrentmsg] = useState({ chat_flag: "", msg: "", room: "", date: "", profile_image: "", username: "" });
    const user = JSON.parse(localStorage.getItem('user'));
    const { currUser, setcurrUser } = useContext(UserContext);
    const navigate = useNavigate();
    //chat states

    const { vis, setvis, chat, setchat, room, setRoom, disconnectVis, setdisconnectVis, support_log, setLog } = useContext(ChatBotContext);
    //video call states
    const { receivingCall, setReceivingCall, name, setName, caller, setCaller, callerSignal, setCallerSignal, setCallAccepted, stream, userVideo, connectionRef, setStream, myVideo } = useContext(VideoCallContext);
    //support Log states
    const [reviewVis, setReviewVis] = useState(0);

    const handleSend = async () => {
        let msg_data;
        if (currUser.designation == '1' || currUser.designation == '2') {
            msg_data = { ...currentmsg, username: currUser.username, name: currUser.name, date: `${new Date(Date.now()).getHours()}:${new Date(Date.now()).getMinutes()}`, profile_image: currUser.profile_image, room: room, chat_flag: '0' };
        } else {
            msg_data = { ...currentmsg, username: currUser.username, name: currUser.name, date: `${new Date(Date.now()).getHours()}:${new Date(Date.now()).getMinutes()}`, profile_image: currUser.profile_image, room: `${currUser.name}@${currUser.username}`, chat_flag: '0' };
        }
        setchat([...chat, {
            ...msg_data, chat_flag: '1'
        }]);
        setCurrentmsg({ ...currentmsg, msg: "" });
        console.log(chat);

        if (msg_data.room) {
            await socket.emit("send_message", msg_data);
        }




    }
    const joinRoom = (name, username) => {
        socket.emit("join_room", { room: `${name}@${username}`, username: username });
        setRoom(`${name}@${username}`);
    }

    const handleSupport = async (support_flag) => {
        try {
            const res = await axios.post("http://localhost:5000/api/v1/support/addSupport", { support_flag: support_flag, socket_id: socket.id }, {
                headers: {
                    Authorization: `Bearer ${user.token}`
                }
            });
            socket.emit("supportReq");
            // console.log(res);

            if (res.status != 200) {
                alert("Please try again!");
            } else {
                setchat([...chat, { chat_flag: '0', msg: "Our Customer support will contact you shortly.", room: "", name: "Chatbot", date: ` ${new Date(Date.now()).getHours()}:${new Date(Date.now()).getMinutes()}` }])
                if (support_flag === '0') {
                    joinRoom(currUser.name, currUser.username);
                } else if (support_flag === '1') {
                    joinRoom(currUser.name, currUser.username);
                } else {
                    joinRoom(currUser.name, currUser.username);

                }
            }
        } catch (e) {
            console.log(e);
        }

    }
    const addSupportLog = async (review) => {
        try {
            const res = await axios.post("http://localhost:5000/api/v1/history/addHistory", { ...support_log, end_time: `${new Date(Date.now()).getHours()}:${new Date(Date.now()).getMinutes()}`, status: (review ? "Resolved" : "Not Resolved") }, {
                headers: {
                    Authorization: `Bearer ${user.token}`
                }
            });
        } catch (e) {
            console.log(e);
        }
    }
    const handleDisconnect = () => {
        // console.log(support_log);

        socket.emit("disconnect_support", { room: room, socket_id: socket.id });
        socket.on("logSupport", (review) => {
            addSupportLog(review)
            socket.emit("leave_room", { room: room, socket_id: socket.id })
        })
        setdisconnectVis(0);



    }
    const handleReview = (ans) => {
        socket.emit("review", { room: room, review: ans });
        setReviewVis(0);
        socket.emit("leave_room", { socket_id: socket.id, room: room });

    }

    useEffect(() => {


        socket.on("callUser", (data) => {
            // console.log("the received signal in user is", data.signal);
            setReceivingCall(true)
            setCaller(data.from)
            setName(data.name)
            setCallerSignal(data.signal)
            navigate('/videocall', { state: { id: null, designation: '0' } });
        })
    }, [])

    useEffect(() => {
        console.log("nice");
        socket.on("receive_message", (msg_data) => {
            setchat([...chat, msg_data]);
        })
    }, [chat])
    useEffect(() => {
        if (user.designation === '0') {
            socket.on("askReview", (room) => {
                setReviewVis(1);

            })
        }
    }, [])


    return (
        <>
            <div className='  fixed flex justify-center items-center bottom-[2rem] right-[2rem] flex-col z-50' >
                {vis == 1 && <div class="flex flex-col items-center justify-center h-[73vh] bg-gray-100 text-gray-800  w-[23rem] min-h-[30rem] rounded-xl">

                    {/* <!-- Component Start --> */}
                    <div class="flex flex-col flex-grow w-full max-w-xl bg-white shadow-xl rounded-xl overflow-hidden">
                        <div className='W-[100%] min-h-[3rem] bg-black flex justify-end items-center'>
                            {disconnectVis && <button className='bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4  h-[100%]' onClick={() => {

                                handleDisconnect();

                            }}>
                                Disconnect

                            </button>}
                        </div>
                        <div class="flex flex-col flex-grow h-0 p-4 overflow-auto">
                            {currUser.designation === '0' && <Chatstart setchat={setchat} chat={chat} username="Chatbot" />}
                            {chat.map((x) => {
                                if (x.msg === null) {
                                    return <>
                                        <div class="flex w-full mt-5 space-x-3 max-w-xs flex-col">
                                            <text className='ml-[12px] flex justify-start'>Chatbot</text>
                                            <div>
                                                <div class="">
                                                    <button id='0' className='p-2 bg-blue-300 rounded m-1 hover:bg-blue-700 ' onClick={(e) => {
                                                        handleSupport(e.target.id);
                                                    }}>Chat</button>
                                                    <button id='2' className='p-2 bg-blue-300 rounded m-1 hover:bg-blue-700 ' onClick={(e) => {
                                                        handleSupport(e.target.id);
                                                    }}>Call</button>
                                                    <button id='1' className='p-2 bg-blue-300 rounded m-1 hover:bg-blue-700 ' onClick={(e) => {
                                                        handleSupport(e.target.id);
                                                    }}>Video Call</button>
                                                </div>
                                                <span class="text-xs text-gray-500 leading-none">{x.date}</span>
                                            </div>
                                        </div>
                                    </>

                                } else {
                                    return <>
                                        {x.chat_flag == '0' ? <Chatleft msg={x.msg} date={x.date} username={x.username} /> : <Chatright msg={x.msg} date={x.date} username={x.username} />}

                                    </>
                                }

                            })}
                            {reviewVis ?
                                <div class="flex w-full mt-5 space-x-3 max-w-xs flex-col">
                                    <text className='ml-[12px] flex justify-start'>Chatbot</text>
                                    <div>
                                        <div class="bg-gray-300 p-3 rounded-r-lg rounded-bl-lg">
                                            <p class="text-sm">Was the issue Resolved successfully By the Customer support?</p>
                                        </div>
                                        <button className='p-2 bg-blue-300 rounded m-1 hover:bg-green-700 min-w-[3rem]' onClick={() => {
                                            handleReview(1)

                                        }}>Yes</button>
                                        <button className='p-2 bg-blue-300 rounded m-1 hover:bg-green-700 min-w-[3rem]' onClick={() => {
                                            handleReview(0)

                                        }}>No</button>
                                    </div>
                                </div> : null
                            }
                        </div>

                        <div class="bg-gray-300 p-4 flex-row">
                            <input value={currentmsg.msg} class="items-center h-10 w-[80%]  rounded px-3 text-sm" type="text" placeholder="Type your message…" onChange={(e) => {
                                setCurrentmsg({ ...currentmsg, msg: e.target.value })
                            }} />
                            <button className='bg-blue-500 w-[20%] hover:bg-blue-700 text-white font-bold py-2 px-4 rounded' onClick={() => {
                                handleSend();

                            }}>Send</button>

                        </div>
                    </div>
                    {/* <!-- Component End  --> */}

                </div>}

                <div className='flex w-[100%] justify-end m-[1rem]'>
                    <button className=' flex items-center justify-center flex-shrink-0 h-[4rem] w-[4rem] rounded-full bg-black ' onClick={() => {
                        setvis(!vis)
                    }}><BiBot className='text-white ' size={40}></BiBot></button>

                </div>


            </div>


        </>
    )
}

export default Chatbot