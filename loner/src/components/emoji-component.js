import React, { useEffect, useState } from 'react'
import emojiJson from './emoji-list.json'


const EmojiPicker = React.memo(({...props}) => {

    const [searchValue, setSearchValue] = useState("")
    const [emojiList, setEmojiList] = useState(Object.entries(emojiJson))

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

    console.log(emojiList.length)
    return (
        <div className="emoji-picker">
            
            <input type="search" value={searchValue} onChange={onSearchChange}/>

            <div className="emoji-container">
                {
                    emojiList.map((val) => {
                        return(
                            <li key={val[0]}>
                                {val[1].map((val) => String.fromCodePoint(parseInt(val, 16)))}
                            </li>
                        )
                    })
                }
            </div>
            
        </div>
    )

})

export default EmojiPicker