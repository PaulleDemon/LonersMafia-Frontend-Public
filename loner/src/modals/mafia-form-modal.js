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

import { createMafia, updateMafia } from "../apis/loner-apis"
import {MAX_LENGTH, MIN_LENGTH} from "../constants/lengths"
import { getFileFromUrl } from "../utils/image"



/**
 * Form for about page to be embedded in the MafiaFormModal tab below
 */

const MaifaModal = ({icon_url="", icon_file="", name="", tag_line="", about="", 
                    update=false, isLoading=false, onSubmitClick, onValueChange}) => {
    
    const [icon, setIcon] = useState({
                                        url: icon_url,
                                        file: icon_file
                                    })

    const [mafiaForm, setMaifaForm] = useState({
                                        name: name,
                                        tag_line: tag_line === null ? "" : tag_line,
                                        about: about === null? "" : about
                                    })
    
    const [error, setError] = useState("")

    const [inputError, setInputError] = useState(false)
    const [crop, setCrop] = useState(false) // when this is true the form is submitted
    const [timedMessage, setTimedMessage] = useState("")

    const mediaRef = useRef()

    useEffect(() => {

        setIcon({
                url: icon_url,
                file: icon_file
        })

    }, [icon_file])
    
    // useState(() => {
    //     onValueChange({spaceForm, icon})
    // }, [spaceForm, icon])

    const handleNameChange = (e) => {

        const value = e.target.value.trim()

        setError("")
        setInputError(false)

        const new_val = {
                            ...mafiaForm,
                            name: value
                        }

        setMaifaForm(new_val)
        
        if (value.length < MIN_LENGTH.mafia_name){
            setError(`Must be atleast of length ${MIN_LENGTH.mafia_name}`)
            return 
        }

        if (!/^[a-zA-Z][a-zA-Z0-9_-]+$/.test(value)){
            setError("Must begin with alphabet and must contain only alpha numeric values")
            setInputError(true)
            return 
        }
        
        onValueChange({mafiaForm: new_val, icon})

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
        const new_img = {
                            file: image,
                            url: URL.createObjectURL(image) 
                        }

        setIcon(new_img)
        onValueChange({mafiaForm: mafiaForm, icon: new_img})

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

    console.log("FORM data: ", mafiaForm.about)

    return (

        <div style={{width: "100%", marginTop: "10px"}}>

            {
                timedMessage ?
                    <TimedMessageModal message={timedMessage} onTimeOut={() => setTimedMessage("")} />
                    :

                null

            }

            <div className="column center">
                
                <div className="mafia-dashboard-container">
                    {/* <img src={icon.url} alt="dashboard" className="mafia-dashboard margin-10px"/> */}
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
                        value={mafiaForm.name} 
                        placeholder="name (eg: memers69)"
                        maxLength={MAX_LENGTH.mafia_name}
                        onChange={handleNameChange}
                        disabled={isLoading || update}
                        name="name"
                        autoFocus
                        />
                
                <input type="text" className={`input margin-10px`} 
                        value={mafiaForm.tag_line} 
                        placeholder="tag line (eg: the happiest place on earth)"
                        maxLength={MAX_LENGTH.mafia_tag_line}
                        onChange={(e) => {
                                        const new_val = {...mafiaForm, tag_line: e.target.value}
                                        setMaifaForm(new_val)
                                        onValueChange({mafiaForm: new_val, icon})
                                        }}
                        disabled={isLoading}
                        name="tag_line"
                        />

                <textarea name="about" placeholder="about" 
                        value={mafiaForm.about}
                        maxLength={MAX_LENGTH.mafia_about}
                        onChange={(e) => {
                            const new_val = {...mafiaForm, about: e.target.value}
                            setMaifaForm(new_val)
                            onValueChange({mafiaForm: new_val, icon})
                        }}
                        className="text-area"
                        disabled={isLoading}
                        />
            <div className="margin-5px"/>
            {
            (isLoading && navigator.onLine) ?
                <LoadingWheel />      
                :
                <button className="btn row center" 
                        onClick={()=>setCrop(true)} 
                        // disabled={!submitBtnEnabled}
                        >
                            <NEXT fill="#fff"/>
                </button>
            }
    
            </div>
        </div>
  
    )
} 

/**
 * Rules to be set for the mafia, which is later to be embedded in the MafiaFormModal tab below
 */
const RulesThemeModal = ({bgImgUrl="", bgImgFile, bgColor="", maifa_rules, 
                            onValueChange, isLoading, }) => {

    const mediaRef = useRef()

    const [loading, setLoading] = useState(isLoading)
    const [error, setError] = useState("")
    const [backgroundTheme, setBackgroundTheme] = useState(bgColor)
    const [background, setBackground] = useState({
        url: bgImgUrl,
        file: bgImgFile
    })
    console.log("Rules: ", maifa_rules, [...maifa_rules, ...Array(5 - maifa_rules.length).fill("")] )

    const [rules, setRules]= useState([...maifa_rules, ...Array(5 - maifa_rules.length).fill("")])


    useEffect(() => {
        setLoading(isLoading)
    }, [isLoading])

    const handleRuleChange = ({e, index}) => {

        const temp_rules = [...rules]
        temp_rules[index] = e.target.value
        setRules(temp_rules)

        onValueChange({rules: temp_rules, backgroundTheme, background})

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

        const new_val = {
                file: image,
                url: URL.createObjectURL(image)
        }
        setBackground(new_val)

        onValueChange({rules, backgroundTheme, background: new_val})
    }

    const handleBgThemeChange = (e) => {

        // if (!CSS.supports("background-color", e.target.value))
        if (!/^#(?:[0-9a-fA-F]{3,4}){1,2}$/i.test(e.target.value)) // check if the color is a valid hex color
            setError("Not a vaild hex color")

        else
            setError("")

        setBackgroundTheme(e.target.value)
        onValueChange({rules, backgroundTheme: e.target.value}, background)

    }

    const removeBackground = () => {
        
        if (mediaRef.current)
            mediaRef.current.value = null
        
        setBackground({
            url: "",
            file: ""
        })

        onValueChange({rules, backgroundTheme, background})

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
                [...rules, ...Array(5-rules.length).fill("")].map((_, index) => {
                    return (
                        <div key={index}>
                            <input type="text"
                                value={rules[index]}
                                placeholder={`rule ${index+1}`}
                                maxLength={MAX_LENGTH.mafia_rule_length}
                                onChange={(e) => handleRuleChange({e, index})} 
                                className="input" 
                                disabled={loading}
                                style={{marginTop: "10px"}}/>
                        </div>
                    )
                })
            }

            <div className="font-14px margin-10px">Color theme</div>
            <div className="row center">
                <div style={{backgroundColor: backgroundTheme, width: "25px", 
                                height: "25px", border: "2px solid #a6a4a4", borderRadius: "5px"
                                }} />
                <input type="text" 
                        maxLength={10} 
                        className="input margin-10px" 
                        placeholder="#fff"
                        value={backgroundTheme}
                        onChange={handleBgThemeChange}
                        disabled={loading}
                        />
            </div>

            <div className="font-14px">Background</div>
            <div className="column center">
                <div className="mafia-reg-bg-img-container">
                    <img src={background.url} alt="" className="mafia-reg-bg-img"/>
                </div>

                <div className="row center">
                    <label htmlFor="file-upload" className="row center">
                            <UPLOAD fill="#6134C1" className="icon"/>
                            <input id="file-upload" type="file" 
                                            style={{display: "none"}}
                                            onChange={handleImageUpload} 
                                            accept="image/png, image/jpeg, image/svg+xml"
                                            disabled={loading}
                                            ref={mediaRef}
                                            />
                    </label>
                    <CLOSE className="icon" onClick={removeBackground}/>
                </div>

            </div>

        </div>
    )
}


export const MaifaFormModal = ({id=null, iconUrl="", bgImgUrl="", 
                                name="", about="", tag_line="", bgColor="", rules,
                                onSuccess, onClose, update=false}) => {
    
    // console.log("URL: ", iconUrl, )
    const [error, setError] = useState("")
    const [icon, setIcon] = useState({
                                        url: iconUrl,
                                        file: ""
                                    })

    const [background, setBackground] = useState({
                                                    url: bgImgUrl,
                                                    file: ""
                                                })
    
    useEffect(() => {

        if (iconUrl)
            getFileFromUrl(iconUrl).then(res => setIcon({...icon, file: res}))

            
        }, [iconUrl])
        // getFileFromUrl(iconUrl).then(res => setIcon({...icon, file: res}))

    const [mafiaForm, setMafiaForm] = useState({
                                            name: name,
                                            about: about,
                                            tag_line: tag_line,
                                            bgColor: bgColor,
                                            rules: rules || Array(5).fill("")
                                        })

    const registerMutation = useMutation(!update ? createMafia : updateMafia, {
        
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

            sessionStorage.setItem("show-invite", "true")
        }
    })

    const handleSubmit = () => {
        
        if (!mafiaForm.name.trim()){
            setError("Enter a mafia name")
            return 
        } 

        if (mafiaForm.name.trim().length < MIN_LENGTH.mafia_name){
            setError("name too short")
            return 
        }
        
        if (!/^[a-zA-Z][a-zA-Z0-9_-]+$/.test(mafiaForm.name)){
            setError("Must begin with alphabet and must contain only alpha numeric values")
            return 
        }
        
        if (!navigator.onLine){
            setError("You are not connected")
            return
        }
        let form_data = new FormData()

        if (!update)
            form_data.append("name", mafiaForm.name)
        
        if (icon.file && iconUrl !== icon.url)
            form_data.append("icon", icon.file)
        
        if (background.file && background.url !== bgImgUrl)
            form_data.append("background_image", background.file)

        // if (spaceForm.tag_line)
        form_data.append("tag_line", mafiaForm.tag_line)
        
        // if (spaceForm.about)
        form_data.append("about", mafiaForm.about)
        
        if (!mafiaForm.rules.sort().every((val, idx) => val === rules?.sort()[idx])) // if rules haven't changed don't upate
            form_data.append("rules", JSON.stringify(mafiaForm.rules))
        
        if (mafiaForm.bgColor)
            form_data.append("color_theme", mafiaForm.bgColor)
        
        let data = form_data

        if (update)
            data = {formData: form_data, id: id}

        registerMutation.mutate(data)
    }

    const handleAboutChange = ({mafiaForm: form, icon}) => {

        console.log("form: ", form, icon)
        setMafiaForm({
            ...mafiaForm,
            ...form
        })

        setIcon({
            ...icon
        })
    }

    const handleRuleThemeChange = ({rules, backgroundTheme, background: bgImage}) => {

        setBackground({
            ...bgImage
        })
        setMafiaForm({
            ...mafiaForm,
            rules: rules,
            bgColor: backgroundTheme
        })

    }

    console.log("Tag lnine: ", tag_line)

    const tabs = useMemo(() => [
        {
            tabName: "About",
            tabValue: "about",
            tabComponent: <MaifaModal onSubmitClick={handleSubmit} 
                                        onValueChange={handleAboutChange}
                                        isLoading={registerMutation.status === "loading"}
                                        icon_url={icon.url}
                                        icon_file={icon.file}
                                        name={mafiaForm.name}
                                        tag_line={mafiaForm.tag_line}
                                        about={mafiaForm.about}
                                        update={update}
                                        />,
        },
        {
            tabName: "Rules & Themes",
            tabValue: "rule",
            tabComponent: <RulesThemeModal 
                                onValueChange={handleRuleThemeChange}
                                isLoading={registerMutation.status === "loading"}
                                maifa_rules={mafiaForm.rules}
                                bgColor={mafiaForm.bgColor}
                                bgImgUrl={background.url}
                                bgImgFile={background.file}
                                    />,
        }

    ], [handleSubmit, registerMutation.status, mafiaForm, icon, background])

    return (

        <div className="modal-background">
            <div className="modal registration-modal mafia-reg-modal">

                <div className="close-container">
                    <CLOSE onClick={onClose} className="icon"/>
                </div>

                <div className="row center title-22px">
                   {!update ? "Start a Mafia" : "Update the Mafia" }
                </div>

                {
                 !update ?
                    <div className="font-18px margin-10px">
                        start a mafia and invite other loners
                    </div>
                    :
                    null
                }
                
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