import React, { useCallback, useEffect, useRef, useState } from 'react'

import { useVisible } from '../utils/hooks'

import emojiJson from './emoji-list.json'


const StickerPicker = React.memo(({onClickOutside, onEmojiClick}) => {

    const [searchValue, setSearchValue] = useState("")
    const [stickerList, setStickerList] = useState(Object.entries(emojiJson))

    const stickerRef = useRef()
    const isVisible = useVisible(stickerRef)

    useEffect(() => {

        const checkClickOutSide = (e) => {
            if(isVisible && onClickOutside && !stickerRef.current.contains(e.target)){
                onClickOutside()
            }
        }

        if (stickerRef.current)
            window.addEventListener("click", checkClickOutSide, {passive: true})

        return () => window.removeEventListener("click", checkClickOutSide)

    }, [stickerRef, isVisible])

    useEffect(() => {

    }, [searchValue])

    const onSearchChange = (e) => {
        setSearchValue(e.target.value)
    }

    
    return (
        <div className="modal" ref={stickerRef}>
            <div className="emoji-container">
                stickers coming soon
            </div>
            
        </div>
    )

})

export default StickerPicker