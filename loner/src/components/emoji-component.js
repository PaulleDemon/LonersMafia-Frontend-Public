import { useEffect, useState } from 'react'
import emojiJson from './emoji-list.json'


export default function EmojiPicker(props){

    const [searchValue, setSearchValue] = useState("")
    const [emojiList, setEmojiList] = useState(Object.values(emojiJson))

    useEffect(() => {

        if (searchValue){
            const new_values = Object.entries(emojiJson).filter(([k,v]) => k.startsWith(searchValue.toLowerCase())).flatMap((k,v) => k[1])
            console.log("New values: ", new_values)
            setEmojiList(new_values)
        }

        else{
            setEmojiList(Object.values(emojiJson))
        }

    }, [searchValue])

    const onSearchChange = (e) => {
        console.log(e.target.value)
        setSearchValue(e.target.value)
    }

    return (
        <div className="emoji-picker">
            
            <input type="search" value={searchValue} onChange={onSearchChange}/>

            <div className="emoji-container">
                {
                    
                }
            </div>
            
        </div>
    )

}