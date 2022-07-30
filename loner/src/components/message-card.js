import { memo, useState, useEffect } from "react"
import { useMutation, useQueryClient } from "react-query"
import { Link } from "react-router-dom";

// import ZoomableImage from "./zoomable-image"
import { toLocalTime } from "../utils/datetime"
import {linkify} from "../utils/linkify"
import { MoreChatOptions } from "./more-options";
import { getFileTypeFromUrl } from "../constants/file" 
import { assignMod, banUser, deleteAndBan, deleteMessage, deleteReaction, reactToMessage } from "../apis/loner-apis";
import { TimedMessageModal } from "../modals/info-modal";

import { formattNumber } from "../utils/formatted-number";
import Login from "./login-component";


const ReactionComponent = ({id=null, emoji, count=0, is_reacted=false, onClick}) => {
    
    return (
        <>
            <div className={`reaction row center ${is_reacted ? "reaction-clicked": ""}`} 
                    onClick={() => onClick(emoji, is_reacted, id)}>
                <div >
                    {emoji}
                </div>
                {
                    count != 0 ?
                    <div className="margin-10px">
                        {count}
                    </div>
                    :
                    null
                }
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

const ChatCard = memo(({currentUserId=null, user_is_mod=false, user_is_staff=false, props}) => {

    
    const {id, message, user, media_url, mafia,
        datetime, is_mod=false, is_staff=false, reactions} = props
    
    const {id: userid, name, avatar_url} = user
    
    const queryClient = useQueryClient() 

    const [timedMessageModal, setTimedMessageModal] = useState("")
    const [showImageEnlarged, setShowImageEnlarged] = useState(false)

    
    const banMutate = useMutation(banUser)
    const assignModMutate = useMutation(assignMod)
    const banFromMafiaMutate = useMutation(deleteAndBan)
    const deleteMessageMutate = useMutation(deleteMessage)
    
    let removedReactionId = null


    const reactMessageMutate = useMutation(reactToMessage, {
        onSuccess: (successData) => {
      
            queryClient.setQueriesData(["chat", mafia], (data) => {
                
                console.log("Chat: ", data)
                // updates all the cached rooms to display the latest message and change the unread count
                const newPagesArray = data.pages.map((data) =>{
                                    // find and update the specific data
                                    const index = data.data.results.findIndex((val) => {
                                        // find the index and update the cache

                                        return val.id == successData.data.message
                                    })
                                    console.log("YAa: ", data, index)

                                    if (index !== -1){
                                        // if the id exists in this page then update otherwise just
                                        // return the data 
                                        const reactions = data.data.results[index]['reactions']
                                        const reaction_index = reactions.findIndex(item  => item.reaction === successData.data.reaction)
                                        
                                        data.data.results[index]['reactions'][reaction_index].id = successData.data.id
                                        data.data.results[index]['reactions'][reaction_index].is_reacted = true
                                        data.data.results[index]['reactions'][reaction_index].reaction_count += 1
                                      
                                    }
                                    return data
                                    }) 
                    
                return {
                    pages: newPagesArray,
                    pageParams: data.pageParams
                }
            })
        }
    }) 

    const reactMessageDeleteMutate = useMutation(deleteReaction, {
        
        onSuccess: (successData) => {
            
            queryClient.setQueriesData(["chat", mafia], (data) => {
                
                // updates all the cached rooms to display the latest message and change the unread count
                const newPagesArray = data.pages.map((data) =>{
                                    // find and update the specific data
                                    const index = data.data.results.findIndex((val) => {
                                        // find the index and update the cache

                                        return val.id == id
                                    })

                                    if (index !== -1){
                                        // if the id exists in this page then update otherwise just
                                        // return the data 
                                        const reactions = data.data.results[index]['reactions']
                                        const reaction_index = reactions.findIndex(item  => item.id === removedReactionId)
                                        
                                        // data.data.results[index]['reactions'][reaction_index].id = successData.data.id
                                        data.data.results[index]['reactions'][reaction_index].is_reacted = false
                                        data.data.results[index]['reactions'][reaction_index].reaction_count -= 1
                                      
                                    }
                                    return data
                                    }) 
                    
                return {
                    pages: newPagesArray,
                    pageParams: data.pageParams
                }
            })

            removedReactionId = null
        }

    }) 



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
            mafia: mafia
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

        banFromMafiaMutate.mutate({
            data: {
                    id: id, 
                    user: userid,
                    mafia: mafia
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

    const onReactToMessage = (emoji, is_reacted, reaction_id) => {

        if (!localStorage.getItem("user-id")){
            return 
        }
        
        if (userid == currentUserId){
            setTimedMessageModal("You can't react to your own message")
            return
        }

        if (currentUserId && is_reacted === false){
            reactMessageMutate.mutate({
                reaction: emoji,
                user:  parseInt(currentUserId),
                message: id
            })
        }

        else{
            reactMessageDeleteMutate.mutate({message: id, reaction: emoji})
            removedReactionId = reaction_id
        }

    }

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

                <div className={`row margin-10px ${currentUserId == userid ? "right-end" : "left-end"}`}>
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
                    
                    {
                        reactions.map((data, index) => {

                            const {id, reaction, is_reacted, reaction_count} = data
                            return (
                                <ReactionComponent key={index} 
                                                    id={id} 
                                                    emoji={reaction} 
                                                    count={formattNumber(reaction_count)} 
                                                    is_reacted={is_reacted} 
                                                    onClick={onReactToMessage}/>
                            )
                        })
                    }
                  
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