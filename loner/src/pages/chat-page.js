import Cookies from "js-cookie"
import React, {useEffect, useMemo, useRef, useState} from "react"
import { useParams } from "react-router-dom"
import { useInfiniteQuery, useQuery } from "react-query"
import useWebSocket, {ReadyState} from "react-use-websocket"

import {ReactComponent as BACK} from "../icons/back.svg"
import {ReactComponent as SHARE} from "../icons/share.svg"
import {ReactComponent as SEND} from "../icons/send.svg"

import ChatCard from "../components/message-component"
import AutoHeightTextarea from "../components/auto-resize-textarea"

import { RegistrationModal, SpaceCreateModal, TimedMessageModal } from "../modals/modals"
import { randInt } from "../utils/random-generator"

import { getMessages, getSpace } from "../apis/loner-apis"
import { Error404 } from "../error-pages/errors"
import { LoadingWheel } from "../components/loading"


function ChatHeader({icon, name, tag_line, rules=[]}){

    const [showRules, setShowRules] = useState(false)

    return (
        <div className="chat-header">
            <BACK className="icon margin-10px"/>

            <div className="row center margin-10px">
                <img src={icon} alt=" " className="space-icon"/>
                <div className="column margin-10px">
                    <div className="space-name">
                        {name}
                    </div>

                    <div className="space-tag font-18px">
                        {tag_line}
                    </div>
                </div>
            </div>
            <SHARE className="margin-10px"/>

            <div className="link font-18px" >
                view rules
            </div>

            <div className="peckspace-promo margin-10px">
                visit <a href="https://peckspace.com/spaces" className="link">Peckspace</a>  Now!
            </div>

        </div>
    )

}

// random texts to be filled for first time users.
const randomTexts = [
    "I am a memer and will send memes now to all the loners 🚀",
    "I am an artist and will show you my best works now!",
    "I am going to speak my mind out!",
    "I love you ❤️‍🔥",
    "I would like fried 🐔 please",
    "I prefer to show you the best of who I am ;)",
    "sending memes to all the loners out there ",
    "I love Mars 🌑",
    "I am going to the moon 🚀",
    "A fried chicken here pless....",
    "Hushhh! keep the noise down", 
    "Party at my house!!!",
    "Invade the Universe"
]


export default function Chat(){

    const [text, setText] = useState("")
    const {space} = useParams() 

    const [socketUrl, setSocketUrl] = useState(`${process.env.REACT_APP_WEBSOCKET_ENDPOINT}/space/${space}/`)
    const [timedMesage, setTimedMessage] = useState("")
    const [messagable, setMessageble] = useState(true)
    const [show404Page, setShow404Page] = useState(false)

    const [spaceDetails, setSpaceDetails] =useState({
                                            name: "",
                                            icon: "",
                                            rules: [],
                                            mods: [],
                                            is_mod: false,
                                            is_staff: false
                                            })

    const [messages, setMessages] = useState([])
    const [socketCloseReason, setSocketCloseReason] = useState("")

    const [scrollToEnd, setScrollToEnd] = useState(true)
    const scrollRef = useRef() // refernce to chat body
    const lastMessageRef = useRef() //reference to the last message div

    const {sendJsonMessage, lastJsonMessage, readyState,} = useWebSocket(socketUrl, {
                                                                onOpen: () => console.log('opend connection'),
                                                                onClose: (closeEvent) => {
                                                                    // console.log("Close Event: ", closeEvent)
                                                                    if (closeEvent.code === 3401){
                                                                        setTimedMessage("You cannot connect to this socket")
                                                                        setSocketCloseReason("You have been banned here. You will not receive realtime messages")
                                                                        setMessageble(false)
                                                                    }
                                                                    
                                                                    else if (closeEvent.code === 3404){
                                                                        setTimedMessage("You cannot connect to this socket")
                                                                        setSocketCloseReason("This space doesn't exist. But you can always create one :)")
                                                                        setMessageble(false)

                                                                    }

                                                                    else
                                                                        setTimedMessage("Connection to server lost. Attempting to reconnect.")
                                                                
                                                                },
                                                                //Will attempt to reconnect on all close events, such as server shutting down
                                                                shouldReconnect: (closeEvent) => {
                                                                    // console.log("Close event: ", closeEvent.code)
                                                                    if (closeEvent.code !== 3401 && closeEvent.code !== 3404){
                                                                        return true
                                                                    }

                                                                    return false
                                                                },
                                                                onError: (error) => {
                                                                    setTimedMessage("something went wrong")
                                                                    // console.log("Error: ", error)
                                                                }
                                                            })
    
    const spaceQuery = useQuery(["space", space], () => getSpace(space), {
        refetchOnMount: true,
        refetchOnWindowFocus: false,
        staleTime: Infinity,

        onSuccess: (data) => {
            console.log("Data: ", data)
        }
    })

    const chatQuery = useInfiniteQuery(["chat", space], getMessages, {

        getNextPageParam: (lastPage, ) => {
            // console.log("PAGE: ", lastPage)
            if (lastPage.data.current < lastPage.data.pages){
                return lastPage.data.current + 1}
            
        },
        refetchOnMount: true,
        refetchOnWindowFocus: false,
        staleTime: Infinity,
        onError: (err) => {
            
            if (err.response?.status === 404)
                setShow404Page(true)
        },

    })

    useEffect(() => {

        const chatPages = []
    
        if (chatQuery.status === "success"){
            chatQuery.data.pages.forEach((x) => {
                x.data.results.forEach( (x) =>{
                    chatPages.push(x)
                }
                )      
            })
            
            /* NOTE: 
            The below commented line removes the duplicate just incase and displays it in the latest order.
            The duplicate value arises because when there is a new message through websocket, we are not
            fetching the same page again(because we don't need to). 
            For example: page1 contains ids: {58, 57, 56} and page 2 has: {55, 54, 53}
            Now a new message is added through websocket. So
            The page1 has ids {59, 58, 57} and page2: has {56, 55, 54} but the 56 was already there in the 
            messages which leads to data duplication and makes it unusable as key for list elements.
            */
            const chat_pages = [...chatPages.reverse(), ...messages].filter((value, index, a) =>
            index === a.findIndex((t) => (t.id === value.id))
            )

            setMessages(chat_pages)
            
        }

    }, [chatQuery.status, chatQuery.data, chatQuery.isFetched])
    
    useEffect(() => {

        if (!localStorage.getItem("sent-first-message"))
            setText(randomTexts[randInt(0, randomTexts.length-1)])

    }, [])
    
    useEffect(() => {

        setSocketUrl(`${process.env.REACT_APP_WEBSOCKET_ENDPOINT}/space/${space}/`) //eg: ws://localhost:8000/ws/space/space/

    }, [space])


    useEffect(() => {

        if (lastJsonMessage && !messages.some(msg => lastJsonMessage.id === msg.id)){
            // console.log("Last message: ", lastJsonMessage)
            setMessages([...messages, lastJsonMessage])
           
        } 

    }, [lastJsonMessage])

    useEffect(() => {
        // when there is a new message scroll to the bottom if the scrollbar is already at bottom
        console.log("scroll to bottom")
        if (scrollToEnd)
            scrollToBottom()

    }, [messages])
    
    useEffect(() => {

        if (!window.navigator.onLine){
            setTimedMessage("You are not connected to internet")
        }

    }, [window.navigator.onLine])

    const currentUserId = useMemo(() => sessionStorage.getItem("user-id"), [sessionStorage.getItem("user-id")])

    const sumbitMessage = () => {

        if (!text.trim())
            return

        if (!navigator.onLine && process.env.NODE_ENV === "production"){
            setTimedMessage("You are offline :(")
            return 
        }

        if (readyState == ReadyState.CONNECTING){
            setTimedMessage("Connecting please wait..")
            return 
        }

        if (readyState == ReadyState.CLOSED){
            setTimedMessage("connection closed. Try refreshing the page or try again later.")
            return 
        }

        sendJsonMessage({
            "message": text
        })

        setText("")
        localStorage.setItem("sent-first-message", "true") // once the user has sent his/her first message stop setting random text to text box
    }

    const scrollToBottom = () => {

        if (scrollRef.current)
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight
            
    }

    const handleChatScroll = (e) =>{
        const bottom = e.target.scrollHeight - e.target.scrollTop <= (e.target.clientHeight + 50)
  
        if (!bottom && scrollToEnd){
            setScrollToEnd(false)
        }

        else if(!scrollToEnd && bottom){
            setScrollToEnd(true)
        }

        // If the scroll-bar is at the top then fetch old messages from the database
        // note: we may also have to check if scroll bar is scrolling to the top
        if (scrollRef.current && (80 >= scrollRef.current.scrollTop 
            || scrollRef.current.clientHeight === scrollRef.current.scrollHeight) 
            && (chatQuery.hasNextPage === undefined || chatQuery.hasNextPage === true)) {
           
                chatQuery.fetchNextPage({cancelRefetch: false})
        }        
    }

    return (
        <>
        { !show404Page ?  
        
            <div className="chat-page">
                <ChatHeader />

                {
                    timedMesage !== ""?
                    <TimedMessageModal message={timedMesage} timeout={2000} onTimeOut={() => setTimedMessage("")}/>
                    :
                    null
                }
                <div className="chat-body" ref={scrollRef} onScroll={handleChatScroll}>

                    {
                        (navigator.onLine && (chatQuery.isLoading || chatQuery.isFetching)) ? 
                            <LoadingWheel />
                            :
                        null
                    }

                    {
                        (!navigator.onLine) ? 

                        <div className="row center">
                            you are not connected to the internet
                        </div>
                        :
                        null
                    }

                    {
                        messages.map((msg) => {
                    
                            return (<li key={msg.id}>
                                        <ChatCard currentUserId={currentUserId} props={msg}/>
                                    </li>)  
                        })
                    }
                </div>

                <div ref={lastMessageRef}/>

                {    
                    
                    messagable ? 
                    <div className="message-container">
                    
                        <AutoHeightTextarea value={text} onChange={e => {setText(e.target.value)}}/>
                    
                        <button className="send-btn" onClick={sumbitMessage}> 
                            <SEND fill="#fff"/>
                        </button>
                    
                    </div>
                    :
                    <div className="message-container margin-10px row center font-18px">
                        {socketCloseReason}
                    </div>
                }
            </div>
            
            :

            <Error404 />
            
            }

        </>
    )

}