import React, { useEffect, useRef, useState } from "react"

import EmojiPicker from "../components/emoji-component"

import {ReactComponent as MEDIA} from "../icons/media.svg"
import {ReactComponent as STICKERS} from "../icons/stickers.svg"
import {ReactComponent as EMOJI} from "../icons/emoji.svg"


const EMOJIPICKER_STYLE = {
                            zIndex: 3,
                            position: "fixed",
                            top: "30%",
                            left: "30%"
                    }


/**
 * This text component expands upwards as the user types in the input.
 * Used to take input for chat app.
 * includes all the props available for textarea jsx(html) element
 */
const AutoHeightTextarea = ({  value, onStickerClick, onMediaClick, ...props }) => {
    
    const textareaRef = useRef(null)

    const [showEmojiPicker, setShowEmojiPicker] = useState(false)
    
    const [text, setText] = useState(value)

    useEffect(() => {
        setText(value)
    }, [value])

    useEffect(() => {

        textareaRef.current.style.height = "0px"
        const scrollHeight = textareaRef.current.scrollHeight
        textareaRef.current.style.height = scrollHeight + "px"

    }, [value, text])

    // const onEmojiClick = (e, emojiObject) => {
    //     console.log("Clicked: ", emojiObject.emoji)
    //     value += emojiObject?.emoji
    // }

    return (
        <div className="autoresize-container">
            
            <textarea
                className="autoresize"
                ref={textareaRef}
                {...props}
                value={text}
                onChange={(e) => {props.onChange(e); console.log("chanegd: ", e.target.value)}}
            />
            // TODO: correct the emoji not trigrring onchange event
            { showEmojiPicker ? 
                <EmojiPicker onEmojiClick={(e, unicode) => {setText(text+`${unicode}`)
                                                            textareaRef.current?.dispatchEvent(new Event("input"), { bubbles: true})
                                                            }} 
                    onClickOutside={() => setShowEmojiPicker(false)}
                />
                
                :
                null
            }   
            
            <div className="media-options row">
                <EMOJI onClick={() => setShowEmojiPicker(true)}/>
                <STICKERS fill="#00F470"/>
                <MEDIA fill="#6134C1"/>
            </div>
        
        </div>
    )
}

export default AutoHeightTextarea