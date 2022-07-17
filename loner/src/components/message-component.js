import { memo, useState, useEffect } from "react";
import { toLocalTime } from "../utils/datetime";
import {linkify} from "../utils/linkify"

/**
 * message: str - message to be displayed
 * datetime: str - datetime when the message was sent
 * media: url | null - media if available
 * is_mod: bool - allows previlages
 * is_staff: bool - allows previlages
 * is_sender: bool - is the user the sender of the message
 * user: object - user who sent the message
 */

const ChatCard = memo(({currentUserId=1, props}) => {

    
    const {message, user, media, datetime, is_mod=false, is_staff=false, is_sender=false} = props
    const {id, name, avatar_url} = user
    console.log("current: ", currentUserId, id)
    return (
        <div className={`chat-card ${currentUserId == id? "right-end" : "left-end"}`}>
            
            <div className="row" style={{gap: "5px"}}>
           
                {currentUserId == id ?

                    <>
                        <div className={`message-body ${is_sender ? "sender right-end" : "receiver left-end"}`}>
                            {linkify(message)}  
                        </div>
                        <img className="user-icon" src={avatar_url} alt="" />
                    </>

                    :
                    <>
                        <img className="user-icon" src={avatar_url} alt="" />
                        <div className={`message-body ${is_sender ? "sender" : "receiver"}`}>
                            {linkify(message)}  
                        </div>
                    </>
                }
                <p className="more">
                    ...
                </p>
            </div>

            <div className="row center">

                <div className="left-end username-time">
                    {toLocalTime(datetime)}
                </div>

                <div className="right-end username-time">
                    l\{name}
                </div>

            </div>
            <div>
                rocket
            </div>
        </div>
    )

})


export default ChatCard