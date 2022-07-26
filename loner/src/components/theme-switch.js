import { useEffect, useState } from "react"

import {ReactComponent as Light} from "../icons/light.svg"
import {ReactComponent as DARK} from "../icons/dark.svg"


// --------------- theme switcher hook -----------


const sameBgColor = ['--default-bg-color', '--char-header', '--chat-text-area-color', '--emoji-picker-bg', 
                    '--modal-bg-color', '--drop-down-bg', '--mafias-pg-header-bg', '--reaction-bg', '--chat-background']

const fontColorElement = '--default-font-color'
const lonerDashboardBg = '--loner-dashboard-bg'

const cardDropShadow = '--card-drop-shadow'

const docElementStyle = document.documentElement.style

const ThemeSwitcher = () => {

    const [theme, setTheme] = useState(1) // 0-dark 1-light
    
    useEffect(() => {

        if (theme === 0){
            for (let x of sameBgColor){
                const bgChange = () => document.documentElement.style.setProperty(x, "#0F3046")
                bgChange()
            }
            
            document.documentElement.style.setProperty(fontColorElement, "#ffffff")
            document.documentElement.style.setProperty(lonerDashboardBg, "#ffffff")
            document.documentElement.style.setProperty(cardDropShadow, "0 0 4px #9d9ea5a9")
        }else{
            for (let x of sameBgColor){
                const bgChange = () => document.documentElement.style.setProperty(x, "#ffffff")
                bgChange()
            }
            document.documentElement.style.setProperty(fontColorElement, "#000000")
            document.documentElement.style.setProperty(lonerDashboardBg, "#000000")
            document.documentElement.style.setProperty(cardDropShadow, "0 0 4px #050f5fe1")
        }

    }, [theme])


    return (
        <div className="margin-10px">
            {   
                theme === 1?
                    <DARK className="theme-icon" onClick={() => setTheme(0)}/>
                    :

                    <Light className="theme-icon" onClick={() => setTheme(1)}/>
            }
        </div>
    )

}

export default ThemeSwitcher