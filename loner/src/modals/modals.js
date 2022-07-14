import { useEffect, useState } from "react"
import randomAvatarGenerator from "../utils/avatar-gnerator"

import {ReactComponent as RELOAD} from "../icons/reload.svg"
import {ReactComponent as NEXT} from "../icons/next.svg"


import MAX_LENGTH from "../constants/max-lengths"


export const RegistrationModal = () => {
    
    const [avatar, setAvatar] = useState({
                                            file: "",
                                            url: ""
                                        })
    const [name, setName] = useState("")
    const [error, setError] = useState("")
    
    useEffect(() => {

        randomAvatar("")

    }, [])

    const randomAvatar =  async () => {

        const random_avatar = await randomAvatarGenerator(name).then(res => res).catch(err => console.log(err))

        setAvatar({
            file: random_avatar,
            url: URL.createObjectURL(random_avatar)
        })
    }

    return (
        <div className="modal registration-modal">
            
            <div className="row center title-22px">
                Quick enter a name and join the loners.
            </div>

            <div className="column center">
                <p>Avatar</p>
                <img src={avatar.url} alt="avatar" className="avatar margin-10px"/>

                <button onClick={randomAvatar} className="btn row center">
                    <RELOAD fill="#fff"/>
                </button>

            </div>

            <p className={`row center font-14px ${error ? "error" : "hidden"}`}>{error}</p>
            <div className="row center">
                <input type="text" className="input margin-10px" value={name} 
                        placeholder="nickname (eg: memer34)"
                        maxLength={MAX_LENGTH.name}
                        onChange={(e) => setName(e.target.value)}
                        autoFocus
                        />

                <button className="btn row center"><NEXT fill="#fff"/></button>
            </div>

            <div className="row center font-14px">
                by clicking on next button you agree to terms and conditions.
            </div>

        </div>
    )
} 


export const RulesModal = () => {

    return (
        <div className="modal">

        </div>
    )
}


export const TermsModal = () => {

    return (
        <div>
            
        </div>
    )
} 