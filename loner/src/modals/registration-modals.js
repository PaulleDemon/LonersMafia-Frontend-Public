import { memo, useEffect, useRef, useState } from "react"
import {useMutation}from "react-query"

import imageCompress from "../utils/image-compress"
import { getFileType, getFileSize } from "../constants/file"
import { getErrorCodeDescription } from "../error-pages/errors"

import { createSpace, createUser } from "../apis/loner-apis"
import { LoadingWheel } from "../components/loading"

import randomAvatarGenerator from "../utils/avatar-gnerator"

import {ReactComponent as RELOAD} from "../icons/reload.svg"
import {ReactComponent as NEXT} from "../icons/next.svg"
import {ReactComponent as UPLOAD} from "../icons/upload.svg"
import {ReactComponent as CLOSE} from "../icons/close.svg"


import {MAX_LENGTH, MIN_LENGTH} from "../constants/lengths"
import {FILE_TYPE_MAPPING} from "../constants/file"
import { randInt } from "../utils/random-generator"
import { CropImage } from "../components/cropper"
import { TimedMessageModal } from "./info-modal"


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

/**
 * Form used to create a space in loners
 */

export const SpaceCreateModal = ({onSuccess, onClose}) => {
    
    const [icon, setIcon] = useState({
                                        url: "",
                                        file: ""
                                    })

    const [spaceForm, setSpaceForm] = useState({
                                        name: "",
                                        tag_line: "",
                                        about: ""
                                    })

    const [error, setError] = useState("")
    const [submitBtnEnabled, setSubmitBtnEnabled] = useState(false)
    const [inputError, setInputError] = useState(false)
    const [submitForm, setSubmitForm] = useState(false) // when this is true the form is submitted
    const [timedMessage, setTimedMessage] = useState("")

    const mediaRef = useRef()
    const registerMutation = useMutation(createSpace, {
        
        onError: (err) => {
            if (err.response?.data && typeof err.response.data === "object"){
                    setError(`${Object.values(err.response.data).join(" ")}`)
                    return 
                }

            error = getErrorCodeDescription(err.code, err.response?.data)
            setError(error.errorDescription)
        },
        onSuccess: (data) => {                
            console.log("Success:")
            if (onSuccess){
                onSuccess(data)
            }
        }
    })

    const handleSubmit = () => {
        
        if (!spaceForm.name.trim()){
            setError("Enter a space name")
            setInputError(true)
            return 
        } 

        if (spaceForm.name.trim().length < MIN_LENGTH.space_name){
            setError("name too short")
            setInputError(true)
            return 
        }
        
        if (!/^[a-zA-Z][a-zA-Z0-9_-]+$/.test(spaceForm.name)){
            setError("Must begin with alphabet and must contain only alpha numeric values")
            setInputError(true)
            return 
        }
        
        if (!navigator.onLine){
            setError("You are not connected")
            return
        }
        let form_data = new FormData()

        form_data.append("name", spaceForm.name)
        
        if (icon.file)
            form_data.append("icon", icon.file)
        
        if (spaceForm.tag_line)
            form_data.append("tag_line", spaceForm.tag_line)
        
        if (spaceForm.about)
            form_data.append("about", spaceForm.about)
        
        registerMutation.mutate(form_data, )
    }

    const handleNameChange = (e) => {

        const value = e.target.value.trim()

        setSubmitBtnEnabled(false)

        setError("")
        setInputError(false)
        setSpaceForm({
            ...spaceForm,
            name: value
        })

        if (spaceForm.name.length < MIN_LENGTH.space_name){
            return 
        }

        if (!/^[a-zA-Z][a-zA-Z0-9_-]+$/.test(value)){
            setError("Must begin with alphabet and must contain only alpha numeric values")
            setInputError(true)
            return 
        }

        setSubmitBtnEnabled(true)
    }


    const handleImageUpload = async (e) => {
        
        if (!e.target.files[0])
			return

        setTimedMessage("Preparing your image.")

        const image = await imageCompress(e.target.files[0])

        const fileSize = getFileSize(image)

		if (fileSize > MAX_LENGTH.file_upload) {
            setError(`File size exceeds ${MAX_LENGTH.file_upload} MiB`)
            return
		} 

        // const file_reader = new FileReader()

        setIcon({
            file: image,
            url: URL.createObjectURL(image) 
        })
        

    }

    const handleCroppedImage = (file) => {
        console.log("FILE: ", file)

        if (file)
            setIcon({
                file: file,
                url: URL.createObjectURL(file)
            })

        handleSubmit()
    }

    return (
        <div className="modal registration-modal">

            {
                timedMessage ?
                    <TimedMessageModal message={timedMessage} onTimeOut={() => setTimedMessage("")} />
                    :

                null

            }

             <div className="close-container">
                <CLOSE onClick={onClose} className="icon"/>
            </div>

            <div className="row center title-22px">
                Think and make a space
            </div>

            <div className="column center">
                
                <div className="space-dashboard-container">
                    {/* <img src={icon.url} alt="dashboard" className="space-dashboard margin-10px"/> */}
                    <CropImage imgFile={icon.file} aspect={1/1} 
                                startCrop={submitForm} 
                                croppedImage={handleCroppedImage}/>
                    
                </div>

                <label htmlFor="file-upload" className="row center">
                        <UPLOAD fill="#6134C1" className="icon"/>
                        <input id="file-upload" type="file" 
                                        style={{display: "none"}}
                                        onChange={handleImageUpload} 
                                        accept="image/png, image/jpeg, image/svg+xml"
                                        ref={mediaRef} 
                                         />
                </label>

            </div>

            <p className={`row center font-14px ${error ? "error" : "hidden"}`}>{error}</p>
            <div className="column center">
               
                <input type="text" className={`input margin-10px ${inputError ? "input-error": ""}`} 
                        value={spaceForm.name} 
                        placeholder="name (eg: space)"
                        maxLength={MAX_LENGTH.space_name}
                        onChange={handleNameChange}
                        disabled={registerMutation.isLoading}
                        name="name"
                        autoFocus
                        />
                
                <input type="text" className={`input margin-10px`} 
                        value={spaceForm.tag_line} 
                        placeholder="tag line (eg: the happiest place on earth)"
                        maxLength={MAX_LENGTH.space_tag_line}
                        onChange={(e) => setSpaceForm({...spaceForm, tag_line: e.target.value})}
                        disabled={registerMutation.isLoading}
                        name="tag_line"
                        autoFocus
                        />

                <textarea name="" id="" placeholder="about" className="text-area"/>

            {
            (registerMutation.status === "loading" && navigator.onLine) ?
                <LoadingWheel />      
                :
                <button className="btn row center" 
                        onClick={()=>setSubmitForm(true)} 
                        disabled={!submitBtnEnabled}>
                            <NEXT fill="#fff"/>
                </button>
            }
       
            </div>
        </div>
    )
} 

