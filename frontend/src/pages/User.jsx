import React, { useEffect } from 'react'
import Chatbot from './Chatbot/Chatbot'

import { useLocation, useNavigate } from "react-router-dom";

const User = (props) => {
    let { socket } = props;
    const location = useLocation();
    const navigate = useNavigate();
    const user = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null;
    useEffect(() => {



    }, [])
    return (
        <>
            {user && user.designation && <>

                <div>
                    user
                </div>
            </>}
        </>

    )
}

export default User