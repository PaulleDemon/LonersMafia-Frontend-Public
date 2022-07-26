import React, { useEffect, useRef, useState } from "react"

import EmojiPicker from "../components/emoji-component"
import StickerPicker from "../components/sticker-component"

import {ReactComponent as MEDIA} from "../icons/media.svg"
import {ReactComponent as STICKERS} from "../icons/stickers.svg"
import {ReactComponent as EMOJI} from "../icons/emoji.svg"

import imageCompress from "../utils/image-compress"
import { getFileType, getFileSize } from "../constants/file"
import { MAX_LENGTH } from "../constants/lengths"
import useWindowDimensions from "../utils/hooks"



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
const AutoHeightTextarea = ({  value, mediaRef=null, onStickerClick, onMediaUpload, 
                                onInfo, onFileUploadError, onSendOnEnter, ...props }) => {
    
    const textareaRef = useRef(null)
    
    const {width} = useWindowDimensions()

    const [text, setText] = useState(value)
    const [showEmojiPicker, setShowEmojiPicker] = useState(false)
    const [showStickerModal, setShowStickerModal] = useState(false)
    

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

    const imageChange = async (e) => {
        
        if (!e.target.files[0])
			return
        
        onInfo("Preparing your image for uploading. Please wait for few seconds")
        
        const image = await imageCompress(e.target.files[0])
        
        handleMedia(image)
    
    }

    const handleMedia = (image) =>{
        // compresses the image and check if the image is allowed

        const fileType = getFileType(image)

        const fileSize = getFileSize(image)

		if (fileSize > MAX_LENGTH.file_upload) {
            onFileUploadError(`File size exceeds ${MAX_LENGTH.file_upload} MiB`)
            return
		} 

        if (["image"].includes(fileType)){

            onMediaUpload({
                fileObject: image,
                fileUrl: URL.createObjectURL(image),
                fileType: fileType
            })
        }

    }

    const handleEnterEvent = (e) => {

        if (e.key === "Enter" && onSendOnEnter && !e.shiftKey && width > 700){
            e.preventDefault()
            onSendOnEnter()
        }

    }

    const onChange = (e) => {

        if (props.onChange)
            props.onChange(e)
    }

    return (
        <div className="autoresize-container">

            <div className="row center">

                <STICKERS onClick={() => {console.log("clicked");setShowStickerModal(!setShowStickerModal)}}/>

                <textarea
                    className="autoresize"
                    ref={textareaRef}
                    {...props}
                    value={text}
                    id="__auto_resize_text__"
                    // onInput={(e) => {props.onChange(e); console.log("chanegd: ", e.target.value)}}
                    onChange={onChange}
                    onKeyUp={handleEnterEvent}
                />
    
                { showEmojiPicker ? 
                    <EmojiPicker onEmojiClick={onEmojiClick} 
                        onClickOutside={() => setShowEmojiPicker(false)}
                    />
                    
                    :
                    null
                }   

                {
                    showStickerModal ?
                    <StickerPicker onClickOutside={() => setShowEmojiPicker(false)}/>
                    :
                    null
                }

                <div className="media-options right-end">
                    <EMOJI onClick={() => setShowEmojiPicker(true)}/>
                    
                    <label htmlFor="file-upload" className="row center">
                        <MEDIA fill="#bb18c7"/>
                        <input id="file-upload" type="file" 
                                        style={{display: "none"}}
                                        onChange={imageChange} 
                                        accept="image/png, image/jpeg, image/gif, image/svg+xml"
                                        ref={mediaRef} 
                                         />
                    </label>
                </div>
                
            </div>
        
        </div>
    )
}

export default AutoHeightTextarea