import Cookies from "js-cookie"
import { memo, useEffect, useState } from "react"
import {useMutation}from "react-query"

import { createUser } from "../apis/loner-apis"
import { LoadingWheel } from "../components/loading"

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
    const [inputError, setInputError] = useState(false)
    
    const registerMutation = useMutation(createUser, {
        onError: (err) => {
            console.log("error: ", err)
        }
    })

    useEffect(() => {

        randomAvatar("")

    }, [])

    const randomAvatar =  async () => {
        // fetches random avatar
        const random_avatar = await randomAvatarGenerator(name).then(res => res).catch(err => console.log(err))

        setAvatar({
            file: random_avatar,
            url: URL.createObjectURL(random_avatar)
        })
    }

    const handleSubmit = () => {
        
        if (!name.trim()){
            setError("Quick give yourself a name")
            setInputError(true)
            return 
        } 


        let form_data = new FormData()
        form_data.append("name", name)
        form_data.append("avatar", avatar.file)


        registerMutation.mutate(form_data)
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
                <input type="text" className={`input margin-10px ${inputError ? "input-error": ""}`} value={name} 
                        placeholder="nickname (eg: memer34)"
                        maxLength={MAX_LENGTH.name}
                        onChange={(e) => setName(e.target.value)}
                        autoFocus
                        />

            {
            registerMutation.isLoading ?
                <LoadingWheel />
                :
                <button className="btn row center" onClick={handleSubmit}><NEXT fill="#fff"/></button>
            }
            
            </div>

            <div className="row center font-14px">
                by clicking on next button you agree to terms and conditions.
            </div>

        </div>
    )
} 



export const SpaceCreateModal = () => {


    return (
        <div className="modal registration-modal">

            <div className="row center">
                Create Space
            </div>

            <div className="">
                <img src={""} alt="avatar" className="avatar margin-10px"/>
            </div>

        </div>
    )

}


export const TermsModal = () => {

    return (
        <div>
            
        </div>
    )

}


export const RulesModal = () => {

    return (
        <div className="modal">

        </div>
    )
}


export const TimedMessageModal = memo(({message, onTimeOut, timeout=2000}) => {

    useEffect(() => {

        setTimeout(() => onTimeOut(), timeout)

    }, [])

    return (
    
        <div className="timed-modal row center">
            {message}
        </div>
            
        
    )
} 
)

// used to ask for consent to store cookies
export const CookieConsentModal = ({onCookieAccept}) => {


    return (
        <div className="modal cookie-modal center margin-10px">
            
            <div className="row center">
                Your lonely browser needs some Cookies, and I am giving it some.
            </div>

            <div className="row center margin-10px">
                <img src={require("../icons/illustrations/cookies.png")} alt="cookie" />
            </div>

            <div className="maring-10px row center font-18px">
                loner website stores necessary cookies for the functioning of the website. It may additionally 
                make use of 3rd party cookies to keep the site running.
            </div>

            <div className="btn margin-10px" onClick={onCookieAccept}>
                Sure Go go ahead
            </div>
        </div>
    )

}