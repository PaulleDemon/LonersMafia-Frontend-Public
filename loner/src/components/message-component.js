import { memo, useState, useEffect } from "react";
import { toLocalTime } from "../utils/datetime";
import {linkify} from "../utils/linkify"
import { MoreChatOptions } from "./more-options";

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

    
    const {message, user, media, datetime, is_mod=false, is_staff=false} = props
    const {id, name, avatar_url} = user
    
    return ( 
        // the == is used instead of === because one is a string and other is an integer
        <div className={`chat-card ${currentUserId == id? "right-end" : "left-end"}`}> 
            
            <div className="row" style={{gap: "5px"}}>
           
                {currentUserId == id ?

                    <>  
                        <div className={`message-body ${currentUserId == id ? "sender right-end" : "receiver left-end"}`}>
                        
                                {linkify(message)}  
               
                        </div>
                        <img className="user-icon" src={avatar_url} alt="" />
                        <div className="row">
                            {/* <KEBAB_MENU className="more-options-btn"/> */}

                            <MoreChatOptions is_mod_message={currentUserId == id}/>
                        </div>
                    </>

                    :
                    <>
                        <img className="user-icon" src={avatar_url} alt="" />
                        <div className={`message-body ${currentUserId == id ? "sender" : "receiver"}`}>
                     
                                {linkify(message)}  
        
                        </div>
                        <div className="row">

                            <MoreChatOptions is_mod_message={currentUserId == id||is_mod}/>
                        </div>
                    </>
                }
                
            </div>


            <div className="row">

                <div className="left-end username-time">
                    {toLocalTime(datetime)}
                </div>
                <div className="margin-10px" />
                <div className="right-end username-time">
                    l\{name}
                </div>

            </div>
            {/* <div>
                rocket
            </div> */}
        </div>
    )

})


export default ChatCard