import React, { useCallback, useEffect, useRef, useState } from 'react'

import { useVisible } from '../utils/hooks'

import emojiJson from './emoji-list.json'


/**
 * Modal that helps to pick emoji. Loads emoji from emoji-list.json
 */
const EmojiPicker = React.memo(({onClickOutside, onEmojiClick}) => {

    const [searchValue, setSearchValue] = useState("")
    const [emojiList, setEmojiList] = useState(Object.entries(emojiJson))

    const pickerRef = useRef()
    const isVisible = useVisible(pickerRef)

    useEffect(() => {

        const checkClickOutSide = (e) => {
            if(isVisible && onClickOutside && !pickerRef.current.contains(e.target)){
                onClickOutside()
            }
        }

        if (pickerRef.current)
            window.addEventListener("click", checkClickOutSide, {passive: true})

        return () => window.removeEventListener("click", checkClickOutSide)

    }, [pickerRef, isVisible])

    useEffect(() => {

        if (searchValue.trim()){
            const new_values = Object.entries(emojiJson).filter(([k,v]) => k.toLowerCase().includes(searchValue.toLowerCase()))//.flatMap((k,v) => k[1])
            setEmojiList(new_values)
        }

        else{
            setEmojiList(Object.entries(emojiJson))
        }

    }, [searchValue])

    const onSearchChange = (e) => {
        setSearchValue(e.target.value)
    }

    
    return (
        <div className="emoji-picker" ref={pickerRef}>
            
            <input type="search" value={searchValue} 
                    onChange={onSearchChange}
                    placeholder="search emoji"
                    autoFocus
                    />

            <div className="emoji-container">
                {
                    emojiList.map((val) => {
                        let unicode = val[1].map((val) => String.fromCodePoint(parseInt(val, 16)))
                        return(
                            <li key={val[0]} className="row center" onClick={(e) => onEmojiClick(e, unicode.join(''))}>
                                {unicode}
                            </li>
                        )
                    })
                }
            </div>
            
        </div>
    )

})

export default EmojiPicker