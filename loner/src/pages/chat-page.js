import React from "react"

import AutoHeightTextarea from "../components/auto-resize-textarea"

import {ReactComponent as BACK} from "../icons/back.svg"
import {ReactComponent as SHARE} from "../icons/share.svg"
import {ReactComponent as SEND} from "../icons/send.svg"
import {ReactComponent as MEDIA} from "../icons/media.svg"
import {ReactComponent as STICKERS} from "../icons/stickers.svg"
import {ReactComponent as EMOJI} from "../icons/emoji.svg"



function ChatHeader({icon, name="Funny", tag_line="coolest", rules}){

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


export default function Chat(){

    return (
        <div>
            <ChatHeader />

            <div class="chat-body">

            </div>
            <AutoHeightTextarea />
        </div>
    )

}