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
    const [chosenEmoji, setChosenEmoji] = useState(null);
    

    useEffect(() => {

        textareaRef.current.style.height = "0px"
        const scrollHeight = textareaRef.current.scrollHeight
        textareaRef.current.style.height = scrollHeight + "px"

    }, [value])

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
                value={value}
                onChange={props.onChange}
            />

            { showEmojiPicker ? 
                <EmojiPicker onEmojiClick={null} 
                        placeholder="search emoji"
                />
                
                :
                null
            }   
            
            <div className="media-options row">
                <EMOJI fill="#E9D415" onClick={() => setShowEmojiPicker(true)}/>
                <STICKERS fill="#00F470"/>
                <MEDIA fill="#6134C1"/>
            </div>
        
        </div>
    )
}

export default AutoHeightTextarea