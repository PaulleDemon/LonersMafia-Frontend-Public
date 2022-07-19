import { memo, useState, useEffect } from "react";

import ZoomableImage from "./zoomable-image"
import { toLocalTime } from "../utils/datetime";
import {linkify} from "../utils/linkify"
import { MoreChatOptions } from "./more-options";
import { getFileTypeFromUrl } from "../constants/file"; 

/**
 * message: str - message to be displayed
 * datetime: str - datetime when the message was sent
 * media: url | null - media if available
 * is_mod: bool - allows previlages
 * is_staff: bool - allows previlages
 * is_sender: bool - is the user the sender of the message
 * user: object - user who sent the message
 * user_is_staff: bool - the current requested user has staff previlages
 * user_is_mod: bool - the current requested user has mod previlages
 */

const ChatCard = memo(({currentUserId=1, user_is_mod=false, user_is_staff=false, props}) => {

    
    const {message, user, media_url, datetime, 
            is_mod=false, is_staff=false} = props

    const {id, name, avatar_url} = user
    
    const [showImageEnlarged, setShowImageEnlarged] = useState(false)

    
    console.log("Details: ", is_mod, is_staff, user_is_mod, user_is_staff)

    let media_content = null

    if (media_url){
        
        if (getFileTypeFromUrl(media_url) === "video"){
            media_content = <video controls alt="video" className="chat-media">
                                <source src={media_url} type="video/mp4" alt="Video"/>
                            </video>
        }

        else if (getFileTypeFromUrl(media_url) === "image"){
            media_content = <img src={media_url} 
                                alt="image" 
                                className="chat-media"
                                // onClick={() => setShowImageEnlarged(true)}
                                />
                            
        }

    }

    return ( 
        // the == is used instead of === because one is a string and other is an integer
        <div className={`chat-card ${currentUserId == id? "right-end" : "left-end"}`}> 
            
            { media_url ?

                <div className={`row margin-10px ${currentUserId == id? "right-end" : "left-end"}`}>
                    {media_content}
                </div>
                :
                null
            }

            {/* {
                showImageEnlarged ?
                <ZoomableImage src={media_url} onClose={() => setShowImageEnlarged(false)}/>
                :
                null
            } */}

            <div className="row" style={{gap: "5px"}}>

                {currentUserId == id ?

                    <>  
                        { message ?
                            <div className={`message-body ${currentUserId == id ? "sender right-end" : "receiver left-end"}`}>
                                {linkify(message)}  
                            </div>
                            :
                            null
                        }   
                        <img className="user-icon" src={avatar_url} alt="" />
                        
                        { 
                           ((user_is_staff||user_is_mod) && (!is_staff))? // mods or other staffs cannot have previlages over other staff messages
                            <div className="row">
                                <MoreChatOptions is_mod_message={currentUserId == id||is_mod}/>
                            </div>
                            :
                            null
                        }
                    </>

                    :
                    <>
                        <img className="user-icon" src={avatar_url} alt="" />
                        {
                            message ?
                            <div className={`message-body ${currentUserId == id ? "sender" : "receiver"}`}>
                                {linkify(message)}  
                            </div>
                            :
                            null
                        }      
                        { 
                           ((user_is_staff||user_is_mod) && (!is_staff))? // mods or other staffs cannot have previlages over other staff messages
                            <div className="row">
                                <MoreChatOptions is_mod_message={is_mod} user_is_staff={user_is_staff}/>
                            </div>
                            :
                            null
                        }
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