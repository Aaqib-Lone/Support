import React from 'react'

const Chatright = (props) => {
    const { msg, date, username } = props;
    return (
        <>
            <div class="flex flex-col  mt-5 space-x-3 max-w-xs ml-auto justify-end">
                <text className='ml-[12px] flex justify-end'>{username}</text>
                <div>
                    <div class="bg-blue-600 text-white p-3 rounded-l-lg rounded-br-lg">
                        <p class="text-sm">{msg}</p>
                    </div>
                    <span class="text-xs text-gray-500 leading-none">{date}</span>

                </div>

            </div>
        </>
    )
}

export default Chatright