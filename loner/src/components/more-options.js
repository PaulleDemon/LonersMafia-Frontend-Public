import { useMemo } from "react"
import { memo, useEffect, useState, useRef } from "react"
import {ReactComponent as KEBAB_MENU} from "../icons/kebab-menu.svg"
import { ConfirmationModal } from "../modals/info-modal"


/**
 * This is for moderators and staff
 * is_staff: bool - staff have special permission and power
 * onDeleteMessage: function - function to call when delete message is clicked
 * onDeleteMessageAndBanUser: function - function to call when delete message and ban user is clicked
 * onDeleteAllBanUser: function - function to call when delete all message and ban user is clicked
 * onAssignMod: function - function to call assign mod is clicked
 * onBanFromLoner: function - function to call ban from loner is clicked
 */
export const MoreChatOptions = memo(({is_staff=false, is_mod_message=false, user_is_staff=false,
                                onDeleteMessage, onDeleteMessageAndBanUser, 
                                onAssignMod, onBanFromLoner
                                }) => {
                 
    const ref = useRef()
    const [showDropDown, setShowDropDown] = useState(false)
    const [confirmationModal, setConfirmationModal] = useState({
                                                                show: false,
                                                                message: "",
                                                                onYesFunction: null
                                                                })
    
    const functionMapping = useMemo(() => {

       return { 
        "__option-1__": [onDeleteMessage, "Are you sure you want to delete this message?"],
        "__option-2__": [onDeleteMessageAndBanUser, "Are you sure you want to delete this message and ban the user?"],
        "__option-3__": [() => onDeleteMessageAndBanUser(true), "Are you sure you want to delete all message and ban the user?"], //the event handler is the same the event handler expects true or false parameter
        "__option-4__": [onAssignMod, "Are you sure you want to assign this user as the moderator?"],
        "__option-5__": [onBanFromLoner, "Are you sure you want to ban this user from Loner?"],
        }

    }, [onDeleteMessage, onDeleteMessageAndBanUser, 
        onAssignMod, onBanFromLoner])
    
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
    
    const handleClick = (e) => {
        
        console.log("Handling...", e.target.id)

        if (Object.keys(functionMapping).includes(e.target.id))
            setConfirmationModal({
                show: true,
                message: functionMapping[e.target.id][1],
                onYesFunction: functionMapping[e.target.id][0]
            })

        else
            setConfirmationModal({
                show: false,
                message: "",
                onYesFunction: null
            })

    }

    const resetConfirmationModal = () => {
        setConfirmationModal({
            show: false,
            message: "",
            onYesFunction: null
        })
    }

    return (
        <div className="dropdown-container" ref={ref}>       
        

            <KEBAB_MENU fill="black" className="more-options-btn" onClick={() => setShowDropDown(true)}/> 

            {
                confirmationModal.show ?
                    <ConfirmationModal message={confirmationModal.message} 
                    onYes={() => {confirmationModal.onYesFunction(); resetConfirmationModal()}} 
                    onNo={resetConfirmationModal}
                    />
                    :
                null
            }

            {    
                showDropDown ?
            
                <div className="dropdown">
                    <div className="dropdown-btn" onClick={handleClick}
                        style={{color: "#ff1900"}}
                        id={"__option-1__"}
                    >
                        Delete message
                    </div>
                    
                    { (!is_staff) ?
                        <>
                            <div className="dropdown-btn" 
                                onClick={handleClick}
                                style={{color: "#ff1900"}}
                                id={"__option-2__"}
                                >
                                Delete message and ban user
                            </div>

                            <div className="dropdown-btn" 
                                onClick={handleClick}
                                style={{color: "#ff1900"}}
                                id={"__option-3__"}
                                >
                                Delete all message and ban the user
                            </div>
                            { !is_mod_message ?
                                <div className="dropdown-btn" onClick={onAssignMod}
                                    style={{color: "#0054fc"}}
                                    id={"__option-4__"}
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
                            onClick={handleClick}
                            style={{color: "#ff1900"}}
                            id={"__option-5__"}
                            >
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