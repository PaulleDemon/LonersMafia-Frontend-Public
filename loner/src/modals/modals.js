import { useEffect, useState } from "react"
import randomAvatarGenerator from "../utils/avatar-gnerator"


export const RegistrationModal = () => {
    
    const [avatar, setAvatar] = useState({
                                            file: "",
                                            url: ""
                                        })
    const [name, setName] = useState("")

    const randomAvatar =  async () => {

        const random_avatar = await randomAvatarGenerator(name).then(res => res).catch(err => console.log(err))

        setAvatar({
            file: random_avatar,
            url: URL.createObjectURL(random_avatar)
        })
    }

    return (
        <div className="modal">
            
            <div>
                Quick enter a name and join the conversation.
            </div>

            <div className="column center">
                <img src={avatar.url} alt="avatar" className="avatar"/>
                <button onClick={randomAvatar}>random</button>
            </div>

            <div className="row center">
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