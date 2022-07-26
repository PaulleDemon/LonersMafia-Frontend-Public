import { useEffect, useState } from "react"

import {ReactComponent as Light} from "../icons/light.svg"
import {ReactComponent as DARK} from "../icons/dark.svg"


// --------------- theme switcher hook -----------


const sameBgColor = ['--default-bg-color', '--chat-header', '--chat-text-area-color', '--emoji-picker-bg', 
                    '--modal-bg-color', '--drop-down-bg', '--mafias-pg-header-bg', '--reaction-bg', 
                    '--chat-background']

const cardDropShadow = '--card-drop-shadow'
const fontColorElement = '--default-font-color'
const lonerDashboardBg = '--loner-dashboard-bg'
const iconFillColor = '--icon-fill-color'
const takePeekBtn = '--take-peel-btn-bg'

const resizeInput = '--auto-resize-input'


const docElementStyle = document.documentElement.style


const ThemeSwitcher = ({className=""}) => {

    const [theme, setTheme] = useState(1) // 0-dark 1-light
    
    useEffect(() => {

        console.log("Theme: ", localStorage.getItem("theme"))

        if ([0, 1].includes(parseInt(localStorage.getItem("theme"))))
            setTheme(parseInt(localStorage.getItem("theme")))

        else
            setTheme(1)

        if (theme === 0){
            for (let x of sameBgColor){
                const bgChange = () => docElementStyle.setProperty(x, "#39423b")
                bgChange()
            }
            
            docElementStyle.setProperty(fontColorElement, "#ffffff")
            docElementStyle.setProperty(iconFillColor, "#ffffff")
            docElementStyle.setProperty(lonerDashboardBg, "#497182")
            docElementStyle.setProperty(cardDropShadow, "0 0 4px #9d9ea5a9")
            
            docElementStyle.setProperty(resizeInput, "#232924")
        }else{
            for (let x of sameBgColor){
                const bgChange = () => docElementStyle.setProperty(x, "#ffffff")
                bgChange()
            }
            docElementStyle.setProperty(fontColorElement, "#000000")
            docElementStyle.setProperty(iconFillColor, "#000000")
            docElementStyle.setProperty(lonerDashboardBg, "#e3fffd")
            docElementStyle.setProperty(cardDropShadow, "0 0 4px #050f5fe1")

            docElementStyle.setProperty(resizeInput, "#fff")

        }

    }, [theme, localStorage.getItem("theme")])

    const handleThemeChange = (val) => {

        localStorage.setItem("theme", `${val}`)
        setTheme(val)
        // console.log(`${val}`)
    }

    return (
        <div className={`margin-10px ${className}`}>
            {   
                theme === 1?
                    <DARK className="theme-icon" onClick={() => handleThemeChange(0)}/>
                    :

                    <Light className="theme-icon" onClick={() => handleThemeChange(1)}/>
            }
        </div>
    )

}

export default ThemeSwitcher