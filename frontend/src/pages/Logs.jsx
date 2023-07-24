import React, { useEffect, useState } from 'react'
import axios from 'axios';
const Logs = () => {
    const [logs, setlogs] = useState([]);
    let count = 0;
    const user = JSON.parse(localStorage.getItem('user'));
    const fetchLogs = async () => {
        try {
            const res = await axios.get("http://localhost:5000/api/v1/history/getHistory", {
                headers: {
                    Authorization: `Bearer ${user.token}`
                }
            });
            setlogs(res.data);
        } catch (e) {
            console.log(e);
        }
    }
    useEffect(() => {

        fetchLogs();
    }, [])
    return (
        <>
            <div className='w-screen min-h-screen bg-gradient-to-r from-purple-800 via-violet-900 to-purple-800 flex justify-center'>
                <div className='rounded-xl   mt-[5rem] flex flex-col   items-center'>
                    <text className=' text-3xl  font-mono font-bold mb-[2rem] text-white'>
                        Customer Suport History
                    </text>
                    <table class="table-auto text-white border-separate space-y-6 text-sm ">
                        <thead class="bg-gray-800 text-white">
                            <tr>
                                <th class="p-3">Sr No.</th>
                                <th class="p-3 text-left">Support User</th>

                                <th class="p-3 text-left">Request User</th>
                                <th class="p-3 text-left">Support Request</th>
                                <th class="p-3">Start Time</th>
                                <th class="p-3 text-left">End Time</th>

                                <th class="p-3 text-left">Date</th>
                                <th class="p-3 text-left">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {logs.map((x) => {
                                count++;

                                return <>
                                    <tr class="bg-gray-800">

                                        <td class="p-3">
                                            {count}
                                        </td>
                                        <td class="p-3">
                                            {x.support_user}

                                        </td>
                                        <td class="p-3">
                                            {x.req_user}

                                        </td>
                                        <td class="p-3">
                                            {x.support_req}

                                        </td>
                                        <td class="p-3">
                                            {x.start_time}

                                        </td>
                                        <td class="p-3">
                                            {x.end_time}

                                        </td>
                                        <td class="p-3">
                                            {x.req_date}

                                        </td>
                                        <td class="p-3">
                                            {x.status}

                                        </td>
                                    </tr>

                                </>
                            })}



                        </tbody>
                    </table>



                </div>
            </div>
        </>
    )
}

export default Logs