import React, {useEffect, useRef, useState} from "react"
import { useParams } from "react-router-dom"

import useWebSocket from "react-use-websocket"

import AutoHeightTextarea from "../components/auto-resize-textarea"


import {ReactComponent as BACK} from "../icons/back.svg"
import {ReactComponent as SHARE} from "../icons/share.svg"
import {ReactComponent as SEND} from "../icons/send.svg"

import ChatCard from "../components/message-component"
import { RegistrationModal } from "../modals/modals"
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


const randomTexts = [
    "I am a memer and will send memes now to all the loners 🚀",
    "I am an artist and will show you my best works now!",
    "I am going to speak my mind out!",
    "I love you ❤️‍🔥",
    "I liked fried 🐔 please",
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

    const [text, setText] = useState(randomTexts[randInt(0, randomTexts.length-1)])
    const {space} = useParams() 
    const socketUrl = `ws://127.0.0.1:8000/ws/space/${space}/`

    const {sendJsonMessage, lastJsonMessage, readyState,} = useWebSocket(socketUrl, {
                                                                onOpen: () => console.log('opened'),
                                                                onClose: () => console.log('closed'),
                                                                //Will attempt to reconnect on all close events, such as server shutting down
                                                                shouldReconnect: (closeEvent) => {
                                                                    
                                                                },
                                                                })

    const sumbitMessage = () => {

        if (!text)
            return

        sendJsonMessage({
            "message": text.trim()
        })
    }

    return (
        <div className="chat-page">
            <ChatHeader />

            <div className="chat-body">
                <ChatCard message="wed"/>
            </div>

            <div className="message-container">
                <AutoHeightTextarea value={text} onChange={e => setText(e.target.value)}/>
                <button className="send-btn" onClick={sumbitMessage}> 
                    <SEND fill="#fff"/>
                </button>
            </div>
        
        </div>
    )

}