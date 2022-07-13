import { useEffect } from "react"


export const RegistrationModal = () => {
    
    const [avatar, setAvatar] = useState("")
    const [name, setName] = useState("")

    return (
        <div className="">

            <div>
                <img src={avatar} alt="" srcset="" />
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