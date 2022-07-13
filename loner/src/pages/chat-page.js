import React, {useState} from "react"

import AutoHeightTextarea from "../components/auto-resize-textarea"

import {ReactComponent as BACK} from "../icons/back.svg"
import {ReactComponent as SHARE} from "../icons/share.svg"
import {ReactComponent as SEND} from "../icons/send.svg"
import ChatCard from "../components/message-component"


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


export function ChatSpace(){


    return (
        <div className="chat-body">
                
            <ChatCard />
            <ChatCard />
            <ChatCard />
            <ChatCard />
            <ChatCard />
            <ChatCard />
            <ChatCard />
            <ChatCard />
            <ChatCard />
            <ChatCard />
            <ChatCard />
            <ChatCard />
            <ChatCard />
            <ChatCard />
            <ChatCard />
            <ChatCard />
            <ChatCard />
        </div>
    )

}


export default function Chat(){

    const [text, setText] = useState("")

    return (
        <div className="chat-page">
            <ChatHeader />

            <ChatSpace />

            <div className="row center">
                <AutoHeightTextarea value={text} onChange={e => setText(e.target.value)}/>
            </div>
        
        </div>
    )

}