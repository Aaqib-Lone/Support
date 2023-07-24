import React, { useState } from 'react'
import Login from '../components/Login';
import Register from '../components/Register';
const Authentication = () => {
    const [toggle, settoggle] = useState(1);
    return (
        <>
            {toggle == 1 ? <Login settoggle={settoggle} /> : <div><Register settoggle={settoggle} /></div>}
        </>
    )
}

export default Authentication;