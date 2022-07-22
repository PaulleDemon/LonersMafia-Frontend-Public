import { memo, useState, useEffect } from "react"
import { useMutation } from "react-query"

// import ZoomableImage from "./zoomable-image"
import { toLocalTime } from "../utils/datetime"
import {linkify} from "../utils/linkify"
import { MoreChatOptions } from "./more-options";
import { getFileTypeFromUrl } from "../constants/file" 
import { assignMod, banUser, deleteAndBan, deleteMessage } from "../apis/loner-apis";
import { TimedMessageModal } from "../modals/info-modal";
import { Link } from "react-router-dom";


const ReactionComponent = ({emoji, count=0, is_clicked=false, onClick}) => {

    return (
        <>
            <div className={`reaction row center ${is_clicked ? "reaction-clicked": ""}`} onClick={onClick}>
                <div >
                    {emoji}
                </div>
                <div className="margin-10px">
                    {count}
                </div>
            </div>
        </>
    )

}


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

    
    const {id, message, user, media_url, space,
        datetime, is_mod=false, is_staff=false, reactions} = props

    const {id: userid, name, avatar_url} = user
    
    const [showImageEnlarged, setShowImageEnlarged] = useState(false)
    const [timedMessageModal, setTimedMessageModal] = useState("")
    
    const banMutate = useMutation(banUser)
    const assignModMutate = useMutation(assignMod)
    const banFromSpaceMutate = useMutation(deleteAndBan)
    const deleteMessageMutate = useMutation(deleteMessage)

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

    const onAssignMod = () => {

        const data = {
            user: userid,
            space: space
        }
        assignModMutate.mutate(data, {
            onError: () => {
                setTimedMessageModal("Something went wrong.")
            }
        })
    }

    const onDeleteMessage = () => {

        deleteMessageMutate.mutate(id, {
            onError: () => {
                setTimedMessageModal("Something went wrong")
            } 
        })
    }

    const onDeleteAndBan = (deleteAll=false) => {

        banFromSpaceMutate.mutate({
            data: {
                    id: id, 
                    user: userid,
                    space: space
                },
            deleteAll: deleteAll
        }, {
            onError: () => setTimedMessageModal("An error occurred")
        })

    }
    
    const onBanFromLoner = () => {

        banMutate.mutate({id: id}, {
            onError: () => setTimedMessageModal("An error occurred")
        })

    }
    console.log(reactions)
    return ( 
        // the == is used instead of === because one is a string and other is an integer
        <div className={`chat-card ${currentUserId == userid? "right-end" : "left-end"}`}> 
            
            {
                timedMessageModal ?
                <TimedMessageModal message={timedMessageModal} onTimeOut={() => setTimedMessageModal("")}/>
                :
                null
            }

            { media_url ?

                <div className={`row margin-10px ${currentUserId == userid? "right-end" : "left-end"}`}>
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

            <div className="row center" style={{gap: "5px"}}>

                {currentUserId == userid ?

                    <>  

                        
                        { message ?
                            <div className={`message-body ${currentUserId == userid ? "sender right-end" : "receiver left-end"}`}>
                                {linkify(message)}  
                            </div>
                            :
                            null
                        } 

                        <Link to={`/loner/${name}/`}>
                            <img className="user-icon" src={avatar_url} alt="" />
                        </Link>
                        
                    </>

                    :
                    <>
                        <Link to={`/loner/${name}/`}>
                            <img className="user-icon" src={avatar_url} alt="" />
                        </Link>
                        {
                            message ?
                            <div className={`message-body ${currentUserId == userid ? "sender right-end" : "receiver left-end"}`}>
                                {linkify(message)}  
                            </div>
                            :
                            null
                        }      


                    </>
                }
                
            </div>
        
            <div className="column">
                <div className="row">

                    <div className="left-end username-time">
                        {toLocalTime(datetime)}
                    </div>
                    <div className="margin-10px" />
                    <div className="right-end username-time">
                        <Link to={`/loner/${name}/`}>l\{name}</Link>
                    </div>

                </div>
                <div className="reactions-container">
                    
                    <ReactionComponent emoji={"🚀"} count={2} is_clicked={false} onClick={() => console.log("clicked")}/>
                    <ReactionComponent emoji={"😭"} count={2} is_clicked={false} onClick={() => console.log("clicked")}/>
                    <ReactionComponent emoji={"🤣"} count={2} is_clicked={false} onClick={() => console.log("clicked")}/>
                    <ReactionComponent emoji={"👎"} count={2} is_clicked={true} onClick={() => console.log("clicked")}/>
                  
                </div>
            </div>

            { 
                ((currentUserId == userid && (user_is_staff||user_is_mod))|| 
                    ((!is_mod && !is_staff) && user_is_mod) || (!is_staff && user_is_staff))? // mods or other staffs cannot have previlages over other staff messages
                <div className={`row margin-10px`}>
                    <MoreChatOptions 
                        is_mod_message={currentUserId == userid||is_mod} 
                        is_staff={is_staff} 
                        is_mod={is_mod}
                        user_is_staff={user_is_staff}
                        onDeleteMessage={onDeleteMessage}
                        onDeleteMessageAndBanUser={onDeleteAndBan}
                        onDeleteAllAndBanUser={onDeleteAndBan}
                        onAssignMod={onAssignMod}
                        onBanFromLoner={onBanFromLoner}
                        />
                </div>
                :
                null
            }
            {/* <div>
                rocket
            </div> */}
        </div>
    )

})


export default ChatCard