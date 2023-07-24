import React from 'react'

const Chatleft = (props) => {
    const { msg, date, username } = props;

    return (
        <>
            <div class="flex  mt-5 space-x-3  flex-col mr-auto">
                <text className='ml-[12px] flex justify-start'>{username}</text>
                <div>
                    <div class="bg-gray-300 p-3 rounded-r-lg rounded-bl-lg">
                        <p class="text-sm">{msg}</p>
                    </div>
                    <span class="text-xs text-gray-500 leading-none">{date}</span>
                </div>
            </div>
        </>
    )
}

export default Chatleft