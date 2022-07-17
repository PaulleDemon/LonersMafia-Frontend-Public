import Cookies from "js-cookie"
import React, {useEffect, useRef, useState} from "react"
import { useParams } from "react-router-dom"

import useWebSocket, {ReadyState} from "react-use-websocket"

import AutoHeightTextarea from "../components/auto-resize-textarea"


import {ReactComponent as BACK} from "../icons/back.svg"
import {ReactComponent as SHARE} from "../icons/share.svg"
import {ReactComponent as SEND} from "../icons/send.svg"

import ChatCard from "../components/message-component"
import { RegistrationModal, SpaceCreateModal, TimedMessageModal } from "../modals/modals"
import { randInt } from "../utils/random-generator"


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
    // const socketUrl = `ws://127.0.0.1:8000/ws/space/${space}/`
    const [socketUrl, setSocketUrl] = useState(`ws://127.0.0.1:8000/ws/space/Cool/`)
    const [timedMesage, setTimedMessage] = useState("")
    const [isBanned, setIsBanned] = useState(false)

    const [messages, setMessages] = useState([])

    const [scrollToEnd, setScrollToEnd] = useState(true)
    const scrollRef = useRef() // refernce to chat body
    const lastMessageRef = useRef() //reference to the last message div

    const {sendJsonMessage, lastJsonMessage, readyState,} = useWebSocket(socketUrl, {
                                                                onOpen: () => console.log('opend connection'),
                                                                onClose: (closeEvent) => {
                                                                    // console.log("Close Event: ", closeEvent)
                                                                    if (closeEvent.code === 3401 || closeEvent.code === 3404){
                                                                        setTimedMessage("You cannot connect to the socket")
                                                                        setIsBanned(true)
                                                                        
                                                                    }
                                                                        
                                                                    else
                                                                        setTimedMessage("Connection to server lost. Attempting to reconnect.")
                                                                
                                                                },
                                                                //Will attempt to reconnect on all close events, such as server shutting down
                                                                shouldReconnect: (closeEvent) => {
                                                                    
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
    
                                                               
    useEffect(() => {

        if (!Cookies.get("sent-first-message"))
            setText(randomTexts[randInt(0, randomTexts.length-1)])

    }, [])

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

        console.log("Online: ", navigator.onLine)
        if (!window.navigator.onLine){
            setTimedMessage("You are not connected to internet")
        }

    }, [window.navigator.onLine])

    const sumbitMessage = () => {

        console.log("sending...", text.trim(), text)
        if (!text.trim())
            return

        if (!navigator.onLine && process.env === "production"){
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
        console.log("Sent", text.trim())

        setText("")
        // Cookies.set("sent-first-message", "true") // once the user has sent his/her first message stop setting random text to text box
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
        // if (scrollRef.current && (20 >= scrollRef.current.scrollTop 
        //     || scrollRef.current.clientHeight === scrollRef.current.scrollHeight) 
        //     && (chatQuery.hasNextPage === undefined || chatQuery.hasNextPage === true)) {
        //     chatQuery.fetchNextPage({cancelRefetch: false})
            
        //     if (messages.length !== 0){

        //         setLastRefId(messages[0].id)
        //         // scrollRef?.current?.scrollIntoView()
        //     }
    

        // }        
    }


    return (
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
                    messages.map((msg) => {
                
                        return (<li key={msg.id}>
                                    <ChatCard props={msg}/>
                                </li>)  
                    })
                }
            </div>

            <div ref={lastMessageRef}/>

            {    
                
                !isBanned ? 
                <div className="message-container">
                    <AutoHeightTextarea value={text} onChange={e => {setText(e.target.value); console.log("Value: ", e.target.value)}}/>
                    <button className="send-btn" onClick={sumbitMessage}> 
                        <SEND fill="#fff"/>
                    </button>
                </div>
                :
                <div className="message-container margin-10px row center font-18px">
                    You have been banned from participating here. You won't recieve real time message.
                </div>
            }
        </div>
    )

}