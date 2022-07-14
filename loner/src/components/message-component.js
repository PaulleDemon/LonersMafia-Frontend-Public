import { memo, useState, useEffect } from "react";


const ChatCard = memo(({message, user={}, media, datetime, is_moderator=false, is_staff=false, is_sender=false}) => {

    const {username, icon} = user

    return (
        <div className={`chat-card ${is_sender ? "right-end" : "left-end"}`}>
            
            <div className="row" style={{gap: "5px"}}>
           
                {is_sender ?

                    <>
                        <div className={`message-body ${is_sender ? "sender" : "receiver"}`}>
                            {message}  
                        </div>
                        <img className="user-icon" src={icon} alt="" />
                    </>

                    :
                    <>
                        <img className="user-icon" src={icon} alt="" />
                        <div className={`message-body ${is_sender ? "sender" : "receiver"}`}>
                            {message}  
                        </div>
                    </>
                }
                <p className="more">
                    ...
                </p>
            </div>

            <div className="row">

                <div className="username-time left-end">
                    {datetime}
                </div>

                <div className="username-time right-end">
                    l\{username}
                </div>

            </div>
        </div>
    )

})


export default ChatCard