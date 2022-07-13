import { useEffect, useState } from "react"
import randomAvatarGenerator from "../utils/avatar-gnerator"


export const RegistrationModal = () => {
    
    const [avatar, setAvatar] = useState("")
    const [name, setName] = useState("")

    const randomAvatar = () => {
        setAvatar(randomAvatarGenerator(name))
    }

    return (
        <div className="">

            <div>
                <img src={avatar} alt="" className=""/>
                <button onClick={randomAvatar}>random</button>
            </div>

            <div className="row">
                <input type="text" className="" value={name} onChange={(e) => setName(e.target.value)} />
                <button>{`->`}</button>
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