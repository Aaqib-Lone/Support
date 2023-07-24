import React from 'react'
import axios from 'axios';
import Peer from 'simple-peer';
import { useState, useRef, useEffect, useContext } from 'react';
import { VideoCallContext } from '../contexts/VideoCallContext';
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
const Videocall = (props) => {
    const { callAccepted, setCallAccepted, stream, setStream, myVideo, userVideo, callEnded, setReceivingCall, setCaller, setName, setCallerSignal, caller, callerSignal, setCallEnded, name, socket, receivingCall } = useContext(VideoCallContext);
    const location = useLocation();
    const [id, setid] = useState('');
    const [called, setcalled] = useState(false);
    const connectionRef = useRef()
    const navigate = useNavigate();

    useEffect(() => {
        if (location.state.id != null && location.state.designation === '1') {
            setid(location.state.id);

        }



    }, [])
    useEffect(() => {


        navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then((stream) => {
            setStream(stream)
            if (myVideo.current != undefined) {
                myVideo.current.srcObject = stream
            }
            window.localStream = stream;
        })


        socket.on("leaveCall", () => {
            if (location.state.designation === '0') {
                window.location = `${window.location.origin}/user`;
            } else if (location.state.designation === '1') {
                window.location = `${window.location.origin}/usersupport`;
            }

        })



    }, [])

    const callUser = (id) => {

        console.log("called");
        const peer = new Peer({
            initiator: true,
            trickle: false,
            stream: stream
        })
        peer.on("signal", (data) => {
            socket.emit("callUser", {
                userToCall: id,
                signalData: data,
                from: socket.id,
                name: "muk"
            })
        })
        peer.on("stream", (stream) => {

            userVideo.current.srcObject = stream

        })
        socket.on("callAccepted", (signal) => {
            setCallAccepted(true)
            peer.signal(signal)
        })

        connectionRef.current = peer





    }

    const answerCall = () => {

        setCallAccepted(true)
        setReceivingCall(false);
        const peer = new Peer({
            initiator: false,
            trickle: false,
            stream: stream
        })
        peer.on("signal", (data) => {
            socket.emit("answerCall", { signal: data, to: caller })
        })
        peer.on("stream", (stream) => {
            console.log("inside stream!!")
            userVideo.current.srcObject = stream
        })

        peer.signal(callerSignal)
        connectionRef.current = peer


    }
    const leaveCall = () => {
        setCallEnded(true)

        try {
            console.log(connectionRef.current)
            connectionRef.current = null;
            console.log(location.state.designation);
            console.log(caller);
            socket.emit("endCall", location.state.designation === '0' ? caller : id);
            if (location.state.designation === '0') {
                window.location = `${window.location.origin}/user`;
            } else if (location.state.designation === '1') {
                window.location = `${window.location.origin}/usersupport`;
            }
        } catch (e) {
            console.log(e);
        }



    }

    return (
        <>
            {
                location.state && <>
                    <div className='w-screen h-screen flex justify-center items-center flex-col md:justify-normal md:items-start md:flex-row bg-[#28282B]'>
                        <div className='fixed w-screen h-screen flex'>
                            <div className=' w-[14rem] h-[10rem]  m-[1rem] z-10'>
                                {stream && <video playsInline autoPlay ref={myVideo} className=' rounded-lg'></video>}


                            </div>
                            <div className=''>
                                {callAccepted && !callEnded ?
                                    <video playsInline autoPlay ref={userVideo} className=' rounded-lg w-[100%] h-[100%]'></video> :
                                    null}
                            </div>
                        </div>

                        {location.state.designation !== '0' && (!called ? <div className='fixed w-screen h-screen flex  justify-center  items-end bottom-[10%]'><div className='flex justify-center items-center'><img src='call.png' class="flex-shrink-0 h-[4rem] w-[4rem] rounded-full bg-gray-300 mr-3" onClick={() => {
                            callUser(id);
                            setcalled(true);
                        }}></img><p className='text-white text-3xl'>{(location.state.name).toUpperCase()}</p></div></div> : null
                        )}
                        {location.state.designation !== '0' && (called && !callAccepted ? <div className='fixed w-screen h-screen flex  justify-center  items-center '><h1 className='text-white text-2xl'>
                            Waiting for User to Join...</h1></div> : null
                        )}
                        {(callAccepted && !callEnded ? <div className='fixed w-screen h-screen flex  justify-center  items-end bottom-[10%]'><div className='flex justify-center items-center'><img src='endcall.png' class="flex-shrink-0 h-[4rem] w-[4rem] rounded-full bg-gray-300 mr-3" onClick={leaveCall}></img><p className='text-white text-3xl'>End Call</p></div></div> : null
                        )}



                        {receivingCall && <div className='fixed w-screen  flex justify-end '><div class="flex mt-5 space-x-3 max-w-xs">

                            <div>
                                <div class="bg-gray-300 p-3 rounded-r-lg rounded-bl-lg">
                                    <p class="text-sm">Incomming call from {caller.split('@')[0]}</p>
                                </div>
                                <button className='p-2 bg-blue-300 rounded m-1 hover:bg-green-700' onClick={() => {
                                    answerCall();

                                }}>Accept</button>
                            </div>
                        </div></div>}
                    </div>
                </>
            }
        </>

    )
}

export default Videocall