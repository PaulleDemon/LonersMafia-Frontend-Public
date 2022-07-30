import { memo, useEffect, useMemo, useRef, useState } from "react"
import {useMutation}from "react-query"

import { getErrorCodeDescription } from "../error-pages/errors"

import { createUser, updateUser, loginUser } from "../apis/loner-apis"
import { LoadingWheel } from "../components/loading"

import randomAvatarGenerator from "../utils/avatar-generator"

import {ReactComponent as RELOAD} from "../icons/reload.svg"
import {ReactComponent as NEXT} from "../icons/next.svg"
import {ReactComponent as CLOSE} from "../icons/close.svg"


import {MAX_LENGTH, MIN_LENGTH} from "../constants/lengths"
import {FILE_TYPE_MAPPING} from "../constants/file"
import { randInt } from "../utils/random-generator"


/**
 * Component used to update or register user
 * 
 * @param onSuccess: function - function to execute when the registration or update is successful
 * @param userAvatar: str(url) - pass the url if update is set to True
 * @param userName: str - pass the name if update is true
 * @param tagLine: str - pass the tagline if update is true
 * @param update: bool - updates the user
 * @param onClose: function - function to execute when close button is clicked
 * 
 */

export const RegistrationModal = ({onSuccess, onError, userAvatar="", userName="", tagline="", 
                                    update=false, onClose}) => {

    console.log("FIle:", userName, tagline)
    const [avatar, setAvatar] = useState({
                                            file: "",
                                            url: userAvatar
                                        })

    const [login, setLogin] = useState(false)
    // const [name, setName] = useState(userName === null? "" : userName)
    const [regForm, setRegForm] = useState({
                                            name: userName === null? "" : userName,
                                            password: "",
                                        })
    const [tagLine, setTagLine] = useState(tagline === null? "" : tagline)

    const [error, setError] = useState("")
    const [inputError, setInputError] = useState(false)
    
    const api = useMemo(() => {

        if (update)
            return updateUser

        else if(login){
            return loginUser
        }

        else
            return createUser

    }, [update, login])

    useEffect(() => {

        if (!update) // reset the form when ever login/signup is clicked
            setRegForm({
                ...regForm,
                name: "",
                password: ""
            })

    }, [login])

    const registerMutation = useMutation(api)

    useEffect(() => {

        if (!update)
            randomAvatar("")

    }, [])

    const randomAvatar =  async () => {
        // fetches random avatar

        let random_avatar = await randomAvatarGenerator(regForm.name)
                                .then(res => res)
                                .catch(err => null)

        if (random_avatar)
            setAvatar({
                file: random_avatar,
                url: URL.createObjectURL(random_avatar)
            })
        
        else{
            setError("something went wrong you can't change the avatar now, you may change it later")
        }
    }

    const handleSubmit = () => {
        
        if (!update){
            if (!regForm.name.trim()){
                setError("Quick give yourself a name")
                setInputError(true)
                return 
            } 

            if (regForm.name.trim().length < MIN_LENGTH.name){
                setError("name too short")
                setInputError(true)
                return 
            }
            
            if (!/^[a-zA-Z][a-zA-Z0-9_-]+$/.test(regForm.name)){
                setError("Must begin with alphabet and must contain only alpha numeric values")
                setInputError(true)
                return 
            }
            
            if (regForm.password.trim().length < 8){
                setError("password must be atleast 8 characters long")
                return 
            }
            
            // if (regForm.password.contains(regForm.name)){
            //     setError("password contains username.")
            //     return 
            // }
        }

        if (!navigator.onLine)
            setError("You are not connected")

        let form_data = new FormData()
        
        if (!update){
            form_data.append("name", regForm.name)
            form_data.append("password", regForm.password)
        }

        if (update && userAvatar === avatar.url && tagLine === tagline)
            return

        if (userAvatar !== avatar.url)
            form_data.append("avatar", avatar.file, `loner-${regForm.name || randInt(0, 10000)}.${FILE_TYPE_MAPPING[avatar.file.type]}`)

        if (tagLine !== tagline){
            form_data.append("tag_line", tagLine.trim())
        }
        
        let form = form_data

        if (update)
            form = {formData: form_data, id: sessionStorage.getItem("user-id")}

        registerMutation.mutate(form, {

            onError: (err) => {
                if (err.response?.data && typeof err.response.data === "object"){
                        setError(`${Object.values(err.response.data).join(" ")}`)
                        return 
                    }

                error = getErrorCodeDescription(err.code, err.response?.data)
                setError(error.errorDescription)

                if (onError)
                    onError(err)
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

        setRegForm({
            ...regForm,
            [e.target.name]: e.target.value,
        })

        if (regForm.name.length < 2 && e.target.name === "name"){
            return 
        }

        if (!/^[a-zA-Z][a-zA-Z0-9_-]+$/.test(value) && e.target.name === "name"){
            setError("Must begin with alphabet and must contain only alpha numeric values")
            setInputError(true)
        }
    }

    let title = "Quick enter a name and join the LonersMafia."

    if (update){
        title = "Update loner profile"
    }

    else if (login){
        title = "Quick prove you belong here."
    }

    return (
        <div className="modal registration-modal">
            
            {
                update ?
                    <div className="close-container">
                        <CLOSE onClick={onClose} className="icon"/>
                    </div>
                :
                null
            } 

     
            <div className="row center title-22px">
                {title}
            </div>
            
            {
                (!update && !login) ?
                    <div className="margin-10px row center font-18px" 
                            onClick={() => setLogin(true)}
                            style={{cursor: "pointer", color: "#1b6aea"}}
                            >
                        Already a loner? Quick login.
                    </div>
                :
                null
            }

            {
                (!update && login )?
                    <div className="margin-10px row center font-18px" 
                            onClick={() => setLogin(false)}
                            style={{cursor: "pointer", color: "#1b6aea"}}
                            >
                        Haven't joined Lonersmafia yet? Quick register
                    </div>
                    :
                null
            }

            {
                !login ?
                <div className="column center">
                    <p>Avatar</p>
                    <img src={avatar.url} alt=" " className="avatar margin-10px"/>

                    <button onClick={randomAvatar} disabled={registerMutation.isLoading} className="btn row center">
                        <RELOAD fill="#fff"/>
                    </button>

                 </div>
                :
                null
            }

            <p className={`row center font-14px ${error ? "error" : "hidden"}`}>{error}</p>
            <div className={`column center `}>
                
                    <input type="text" className={`input margin-10px ${inputError ? "input-error": ""}`} 
                            value={regForm.name} 
                            name="name"
                            placeholder="nickname (eg: memer34)"
                            maxLength={MAX_LENGTH.name}
                            onChange={handleInputChange}
                            disabled={registerMutation.isLoading || update}
                            autoFocus
                            />

                    {
                        update ? 
                            <input type="text" className={`input margin-10px ${inputError ? "input-error": ""}`}
                                    value={tagLine} 
                                    placeholder="tag line (memer since, 1685)"
                                    maxLength={MAX_LENGTH.tag_line}
                                    onChange={(e) => setTagLine(e.target.value)}
                                    disabled={registerMutation.isLoading}
                                    autoFocus
                            />
                        :
                        null
                    }

                    {
                        !update ? 
                            <input type="password" className={`input margin-10px ${inputError ? "input-error": ""}`}
                                value={regForm.password} 
                                name="password"
                                placeholder="password"
                                maxLength={MAX_LENGTH.password}
                                onChange={handleInputChange}
                                disabled={registerMutation.isLoading}
                                />
                        :
                        null
                    }

            {
            (registerMutation.status === "loading" && registerMutation.status !== "error" && navigator.onLine) ?
                <LoadingWheel />      
                :
                <button className="btn row center" onClick={handleSubmit}><NEXT fill="#fff" width="25px" height="25px"/></button>
            }
       
            </div>

            { 
                (!update && !login) ?
                <div className="row center font-14px">
                    by clicking on next button you agree to terms and conditions.
                </div>
                :

                null
            }
        </div>
    )
} 
