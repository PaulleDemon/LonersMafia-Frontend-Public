import { memo, useEffect, useState, useRef } from "react"
import {ReactComponent as KEBAB_MENU} from "../icons/kebab-menu.svg"


/**
 * This is for moderators and staff
 * is_staff: bool - staff have special permission and power
 * onDeleteMessage: function - function to call when delete message is clicked
 * onDeleteMessageAndBanUser: function - function to call when delete message and ban user is clicked
 */
export const MoreChatOptions = memo(({is_staff=false, is_mod_message=false, user_is_staff=false,
                                onDeleteMessage, onDeleteMessageAndBanUser, onDeleteAllAndBanUser, 
                                onAssignMod, onBanFromLoner
                                }) => {
                 
    const ref = useRef()
    const [showDropDown, setShowDropDown] = useState(false)

    useEffect(() => {

        const handleClickOutside = (e) => {
            if (!ref.current?.contains(e.target)){
                setShowDropDown(false)
                window.removeEventListener("click", handleClickOutside)
            }

        }

        if (showDropDown)
            window.addEventListener("click", handleClickOutside)

        return () => window.removeEventListener("click", handleClickOutside)

    }, [ref, showDropDown])

    console.log("USers:", is_mod_message, is_staff, user_is_staff)
   

    return (
        <div className="dropdown-container" ref={ref}>       
        

            <KEBAB_MENU fill="black" className="more-options-btn" onClick={() => setShowDropDown(true)}/> 

            {    
                showDropDown ?
            
                <div className="dropdown">
                    <div className="dropdown-btn" onClick={onDeleteMessage}
                        style={{color: "#ff1900"}}
                    >
                        Delete message
                    </div>
                    
                    { (!is_staff) ?
                        <>
                            <div className="dropdown-btn" 
                                onClick={onDeleteMessageAndBanUser}
                                style={{color: "#ff1900"}}
                                >
                                Delete message and ban user
                            </div>

                            <div className="dropdown-btn" 
                                onClick={onDeleteAllAndBanUser}
                                style={{color: "#ff1900"}}
                                >
                                Delete all message and ban the user
                            </div>
                            { !is_mod_message ?
                                <div className="dropdown-btn" onClick={onAssignMod}
                                    style={{color: "#0054fc"}}
                                >
                                    Assign mod role
                                </div>
                                :
                                null
                            }
                        </>
                        :
                        null
                    }
                    
                    { (user_is_staff && !is_staff)?
                        
                        <div className="dropdown-btn" 
                            onClick={onBanFromLoner}
                            style={{color: "#ff1900"}}>
                            Ban User from loner
                        </div>

                        :
                        null
                    }
                </div>
                :
                null
                }
        </div>
    )

}
)