import Cookies from "js-cookie"
import { memo, useEffect, useState } from "react"
import {useMutation}from "react-query"

import { getErrorCodeDescription } from "../error-pages/errors"

import { createUser } from "../apis/loner-apis"
import { LoadingWheel } from "../components/loading"

import randomAvatarGenerator from "../utils/avatar-gnerator"

import {ReactComponent as RELOAD} from "../icons/reload.svg"
import {ReactComponent as NEXT} from "../icons/next.svg"


import {MAX_LENGTH, MIN_LENGTH} from "../constants/lengths"
import {FILE_TYPE_MAPPING} from "../constants/file"
import { randInt } from "../utils/random-generator"


export const RegistrationModal = ({onSuccess}) => {
    
    const [avatar, setAvatar] = useState({
                                            file: "",
                                            url: ""
                                        })
    const [name, setName] = useState("")
    const [error, setError] = useState("")
    const [inputError, setInputError] = useState(false)
    
    const registerMutation = useMutation(createUser, {
        // onError: (err) => {
        //     console.log("error: ", err, ":")
            
        //     // if (err.response?.data && typeof err.response.data === "object"){
        //     //     console.log("error set")
        //     //     setError(`${Object.values(err.response.data).join(" ")}`)
        //     //     // return 
        //     // }
        //     error = getErrorCodeDescription(err.code, err.response?.data)
        //     setError(error.errorDescription)
        //     console.log("error set2")
        // }
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

        if (name.trim().length < MIN_LENGTH.name){
            setError("name too short")
            setInputError(true)
            return 
        }
        
        if (!/^[a-zA-Z][a-zA-Z0-9_-]+$/.test(name)){
            setError("Must begin with alphabet and must contain only alpha numeric values")
            setInputError(true)
            return 
        }
        
        if (!navigator.onLine)
            setError("You are not connected")

        let form_data = new FormData()
        form_data.append("name", name)
        form_data.append("avatar", avatar.file, `loner-${name || randInt(0, 10000)}.${FILE_TYPE_MAPPING[avatar.file.type]}`)

        
        registerMutation.mutate(form_data, {
            onError: (err) => {
                if (err.response?.data && typeof err.response.data === "object"){
                        setError(`${Object.values(err.response.data).join(" ")}`)
                        return 
                    }

                error = getErrorCodeDescription(err.code, err.response?.data)
                setError(error.errorDescription)
            },
            onSuccess: (data) => {                
                if (onSuccess)
                    onSuccess(data)
            }
        })
    }

    const handleInputChange = (e) => {

        const value = e.target.value.trim()

        setError("")
        setInputError(false)
        setName(value)

        if (name.length < 2){
            return 
        }

        if (!/^[a-zA-Z][a-zA-Z0-9_-]+$/.test(value)){
            setError("Must begin with alphabet and must contain only alpha numeric values")
            setInputError(true)
        }
    }

    // console.log("status: ", registerMutation.status)
    return (
        <div className="modal registration-modal">
            
            <div className="row center title-22px">
                Quick enter a name and join the loners.
            </div>

            <div className="column center">
                <p>Avatar</p>
                <img src={avatar.url} alt="avatar" className="avatar margin-10px"/>

                <button onClick={randomAvatar} disabled={registerMutation.isLoading} className="btn row center">
                    <RELOAD fill="#fff"/>
                </button>

            </div>

            <p className={`row center font-14px ${error ? "error" : "hidden"}`}>{error}</p>
            <div className="row center">
                <input type="text" className={`input margin-10px ${inputError ? "input-error": ""}`} value={name} 
                        placeholder="nickname (eg: memer34)"
                        maxLength={MAX_LENGTH.name}
                        onChange={handleInputChange}
                        disabled={registerMutation.isLoading}
                        autoFocus
                        />

            {
            (registerMutation.status === "loading" && navigator.onLine) ?
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

/**
 * message: str - message to be displayed
 * onTimedOut: function - function to execute when the timer stops
 * timeout: number - seconds to countdown
 */

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