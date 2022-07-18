import React, { useEffect, useRef, useState } from "react"

import EmojiPicker from "../components/emoji-component"

import {ReactComponent as MEDIA} from "../icons/media.svg"
import {ReactComponent as STICKERS} from "../icons/stickers.svg"
import {ReactComponent as EMOJI} from "../icons/emoji.svg"



const inputTypes = [ // used to trigger manual change event 
    window.HTMLInputElement,
    window.HTMLSelectElement,
    window.HTMLTextAreaElement,
]
                    

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

    const triggerInputChange = (node, value = '') => {
        // Manually triggers change event
        // only process the change on elements we know have a value setter in their constructor
        if ( inputTypes.indexOf(node.__proto__.constructor) >-1 ) {
    
            const setValue = Object.getOwnPropertyDescriptor(node.__proto__, 'value').set;
            const event = new Event('input', { bubbles: true });
    
            setValue.call(node, value);
            node.dispatchEvent(event);
    
        }
    
    };

    const onEmojiClick = (e, unicode) => {
        
        setText(text+`${unicode}`)
        const input = document.getElementById('__auto_resize_text__')
        triggerInputChange(input, text+`${unicode}`)

    }

    return (
        <div className="autoresize-container">
            
            <textarea
                className="autoresize"
                ref={textareaRef}
                {...props}
                value={text}
                id="__auto_resize_text__"
                // onInput={(e) => {props.onChange(e); console.log("chanegd: ", e.target.value)}}
                onChange={props.onChange}
            />
 
            { showEmojiPicker ? 
                <EmojiPicker onEmojiClick={onEmojiClick} 
                    onClickOutside={() => setShowEmojiPicker(false)}
                />
                
                :
                null
            }   
            
            <div className="media-options row">
                <EMOJI onClick={() => setShowEmojiPicker(true)}/>
                <STICKERS fill="#00F470"/>
                
                <label htmlFor="file-upload" className="row center">
                    <MEDIA fill="#6134C1"/>
                    <input id="file-upload" type="file" style={{display: "none"}} accept="image/png, image/jpeg, image/gif, image/svg+xml"/>
                </label>
  
            </div>
        
        </div>
    )
}

export default AutoHeightTextarea