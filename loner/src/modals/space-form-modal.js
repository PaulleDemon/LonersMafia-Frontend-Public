import { memo, useEffect, useMemo, useRef, useState } from "react"
import {useMutation}from "react-query"

import { getErrorCodeDescription } from "../error-pages/errors"

import { LoadingWheel } from "../components/loading"
import { CropImage } from "../components/cropper"
import { TimedMessageModal } from "./info-modal"
import Tabs from "../components/tabs"

import {ReactComponent as NEXT} from "../icons/next.svg"
import {ReactComponent as CLOSE} from "../icons/close.svg"

import {ReactComponent as UPLOAD} from "../icons/upload.svg"

import imageCompress from "../utils/image-compress"
import { getFileSize } from "../constants/file"

import { createSpace } from "../apis/loner-apis"
import {MAX_LENGTH, MIN_LENGTH} from "../constants/lengths"



/**
 * Form used to create a space in loners
 */

const SpaceModal = ({icon_url="", name="", tag_line="", about="", 
                    update=false, isLoading=false, onSubmitClick, onClose}) => {
    
    const [icon, setIcon] = useState({
                                        url: icon_url,
                                        file: ""
                                    })

    const [spaceForm, setSpaceForm] = useState({
                                        name: name,
                                        tag_line: tag_line,
                                        about: about
                                    })

    const [error, setError] = useState("")
    const [submitBtnEnabled, setSubmitBtnEnabled] = useState(false)
    const [inputError, setInputError] = useState(false)
    const [crop, setCrop] = useState(false) // when this is true the form is submitted
    const [timedMessage, setTimedMessage] = useState("")

    const mediaRef = useRef()


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

        setCrop(false)
        if (file)
            setIcon({
                file: file,
                url: URL.createObjectURL(file)
            })

        onSubmitClick()
    }

    return (

        <div style={{width: "100%", marginTop: "10px"}}>

            {
                timedMessage ?
                    <TimedMessageModal message={timedMessage} onTimeOut={() => setTimedMessage("")} />
                    :

                null

            }

            <div className="column center">
                
                <div className="space-dashboard-container">
                    {/* <img src={icon.url} alt="dashboard" className="space-dashboard margin-10px"/> */}
                    <CropImage imgFile={icon.file} aspect={1/1} 
                                startCrop={crop} 
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
                        disabled={isLoading || update}
                        name="name"
                        autoFocus
                        />
                
                <input type="text" className={`input margin-10px`} 
                        value={spaceForm.tag_line} 
                        placeholder="tag line (eg: the happiest place on earth)"
                        maxLength={MAX_LENGTH.space_tag_line}
                        onChange={(e) => setSpaceForm({...spaceForm, tag_line: e.target.value})}
                        disabled={isLoading}
                        name="tag_line"
                        />

                <textarea name="" id="" placeholder="about" 
                        className="text-area"
                        disabled={isLoading}
                        />

            {
            (isLoading && navigator.onLine) ?
                <LoadingWheel />      
                :
                <button className="btn row center" 
                        onClick={()=>setCrop(true)} 
                        disabled={!submitBtnEnabled}>
                            <NEXT fill="#fff"/>
                </button>
            }
    
            </div>
        </div>
  
    )
} 


const RulesThemeModal = ({bgImage="", bgColor="#fff", space_rules=Array(5).fill("")}) => {

    const [error, setError] = useState("")
    const [backgroundTheme, setBackgroundTheme] = useState(bgColor)
    const [background, setBackground] = useState({
        url: bgImage,
        file: ""
    })

    const [rules, setRules]= useState(space_rules)

    const handleRuleChange = ({e, index}) => {

        const temp_rules = [...rules]
        temp_rules[index] = e.target.value
        setRules(temp_rules)

    }

    const handleImageUpload =  async (e) => {
        
        if (!e.target.files[0])
			return

        const image = await imageCompress(e.target.files[0])

        const fileSize = getFileSize(image)

		if (fileSize > MAX_LENGTH.file_upload) {
            setError(`File size exceeds ${MAX_LENGTH.file_upload} MiB`)
            return
		} 

        // const file_reader = new FileReader()

        setBackground({
            file: image,
            url: URL.createObjectURL(image) 
        })
    }

    const handleBgThemeChange = (e) => {

        if (!CSS.supports("background-color", e.target.value))
            setError("Not a vaild color")

        else
            setError("")

        setBackgroundTheme(e.target.value)

    }

    return (
        <div style={{width: "100%", marginTop: "10px" }}>

            <div className="column center font-18px">
                Add rules that the loners of the Mafia should follow
            </div>
            {
                error ? 
                    <div className="row center error font-14px">{error}</div>
                :
                null
            }

            {
                rules.map((_, index) => {
                    return (
                        <div key={index}>
                            <input type="text"
                                value={rules[index]}
                                placeholder={`rule ${index+1}`}
                                maxLength={MAX_LENGTH.space_rule_length}
                                onChange={(e) => handleRuleChange({e, index})} 
                                className="input" 
                                style={{marginTop: "10px"}}/>
                        </div>
                    )
                })
            }

            <div className="font-14px margin-10px">Color theme</div>
            <div className="row center margin-10px">
                <div style={{backgroundColor: backgroundTheme, width: "25px", 
                                height: "25px", border: "2px solid #a6a4a4", borderRadius: "5px"
                                }} />
                <input type="text" 
                        maxLength={10} 
                        className="input margin-10px" 
                        placeholder="#fff"
                        value={backgroundTheme}
                        onChange={handleBgThemeChange}
                        />
            </div>

            <div className="font-14px margin-10px">Background</div>
            <div className="column center">
                <div className="space-reg-bg-img-container">
                    <img src={background.url} alt="" srcset="" className="space-reg-bg-img"/>
                </div>
                <label htmlFor="file-upload" className="row center">
                        <UPLOAD fill="#6134C1" className="icon"/>
                        <input id="file-upload" type="file" 
                                        style={{display: "none"}}
                                        onChange={handleImageUpload} 
                                        accept="image/png, image/jpeg, image/svg+xml"
                                        // ref={mediaRef} 
                                        />
                </label>

            </div>

        </div>
    )
}


export const SpaceFormModal = ({onSuccess, onClose, update=false}) => {

    const [error, setError] = useState("")
    const [icon, setIcon] = useState({
                                        url: "",
                                        file: ""
                                    })

    const [background, setBackground] = useState({
                                                    url: "",
                                                    file: ""
                                                })

    const [spaceForm, setSpaceForm] = useState({
                                            name: "",
                                            icon: "",
                                            about: "",
                                            bgColor: "#fff",
                                            rules: []
                                        })

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

            setIcon({
                file: "",
                url: ""
            })

            if (onSuccess){
                onSuccess(data)
            }
        }
    })

    const handleSubmit = () => {
        
        if (!spaceForm.name.trim()){
            setError("Enter a space name")
            return 
        } 

        if (spaceForm.name.trim().length < MIN_LENGTH.space_name){
            setError("name too short")
            return 
        }
        
        if (!/^[a-zA-Z][a-zA-Z0-9_-]+$/.test(spaceForm.name)){
            setError("Must begin with alphabet and must contain only alpha numeric values")
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

    const tabs = useMemo(() => [
        {
            tabName: "About",
            tabValue: "about",
            tabComponent: <SpaceModal onSubmitClick={handleSubmit}/>,
        },
        {
            tabName: "Rules & Themes",
            tabValue: "rule",
            tabComponent: <RulesThemeModal />,
        }

    ], [handleSubmit])

    return (

        <div className="modal-background">
            <div className="modal registration-modal" style={{height: "700px"}}>

                <div className="close-container">
                    <CLOSE onClick={onClose} className="icon"/>
                </div>

                <div className="row center title-22px">
                    Create a space 
                </div>

                <div className="font-18px margin-10px">
                 create a space and invite other loners
                </div>
                
                {
                    error ? 
                        <div className="font-14px error">{error}</div>
                        :
                    null
                }

                <Tabs tabs={tabs}/>

            </div>
        </div>
    )

}