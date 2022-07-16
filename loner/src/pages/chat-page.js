import Cookies from "js-cookie"
import React, {useEffect, useRef, useState} from "react"
import { useParams } from "react-router-dom"

import useWebSocket, {ReadyState} from "react-use-websocket"

import AutoHeightTextarea from "../components/auto-resize-textarea"


import {ReactComponent as BACK} from "../icons/back.svg"
import {ReactComponent as SHARE} from "../icons/share.svg"
import {ReactComponent as SEND} from "../icons/send.svg"

import ChatCard from "../components/message-component"
import { RegistrationModal, TimedMessageModal } from "../modals/modals"
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

    const [scrollToEnd, setScrollToEnd] = useState(false)
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

        if (!messages.includes(lastJsonMessage) && lastJsonMessage !== null){
            console.log("Last message: ", lastJsonMessage)
            setMessages([...messages, lastJsonMessage])
        } 

    }, [lastJsonMessage])

    useEffect(() => {

        if (!navigator.onLine){
            setTimedMessage("You are not connected to internet")
        }

    }, [navigator.onLine])

    const sumbitMessage = () => {

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
            "message": text.trim()
        })

        setText("")
        // Cookies.set("sent-first-message", "true") // once the user has sent his/her first message stop setting random text to text box
    }
    console.log("MEssages: ", messages)

    const handleChatScroll = (e) => {
        
        const scrollTop = e.target?.scrollTop
        const scrollHeight = e.target?.scrollHeight
        const elementHeight = e.target?.offsetHeight
        console.log("scroll: ", elementHeight, ((e.target.scrollTop+e.target.scrollHeight)- elementHeight))
        // check if the user is already at bottom, if user is already at bottom when new messages,
        // is pushed scorll to the new message
        if((e.target.scrollTop+e.target.scrollHeight) > 100){ 
            console.log("True")
        }
    
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
                    messages.map((msg, index) => {
                        console.log("Msg: ", msg)
                        if (index === messages.length-1 && scrollRef?.current?.scrollBottom <= 100){
                            setTimeout(() => lastMessageRef?.current?.scrollIntoView(), 2)
                        }
                        return (<li key={msg.id} ref={(index === messages.length-1)? lastMessageRef : null}>
                                    <ChatCard props={msg}/>
                                </li>)  
                    })
                }
            </div>

            {    
                
                !isBanned ? 
                <div className="message-container">
                    <AutoHeightTextarea value={text} onChange={e => setText(e.target.value)}/>
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