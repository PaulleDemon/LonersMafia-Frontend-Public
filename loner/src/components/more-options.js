import { useEffect, useState, useRef } from "react"


/**
 * This is for moderators and staff
 * is_staff: bool - staff have special permission and power
 * onDeleteMessage: function - function to call when delete message is clicked
 * onDeleteMessageAndBanUser: function - function to call when delete message and ban user is clicked
 */
export const MoreChatOptions = ({is_staff=false, is_mod_message=false, onClose,
                                onDeleteMessage, 
                                onDeleteMessageAndBanUser, onDeleteAllAndBanUser, onAssignMod,
                                onBanFromLoner
                                }) => {
                                   
    const ref = useRef()

    useEffect(() => {

        const handleClickOutside = (e) => {
            console.log("Clicked outside")
            if (!ref.current.contains(e.target)){
                onClose()
            }

        }

        window.addEventListener("click", handleClickOutside)

        return () => window.removeEventListener("click", handleClickOutside)

    }, [ref])

    if (is_mod_message && !is_staff){
        return null
    }

    return (
        <div className="dropdown-container column center" ref={ref}>       

            <div className="dropdown">
                <div className="dropdown-btn" onClick={onDeleteMessage}
                    style={{color: "#ff1900"}}
                >
                    Delete Message
                </div>
                
                { (!is_mod_message || is_staff) ?
                    <>
                        <div className="dropdown-btn" 
                            onClick={onDeleteMessageAndBanUser}
                            style={{color: "#ff1900"}}
                            >
                            Delete Message and ban user
                        </div>

                        <div className="dropdown-btn" 
                             onClick={onDeleteAllAndBanUser}
                             style={{color: "#ff1900"}}
                            >
                            Delete all message and ban the user
                        </div>

                        <div className="dropdown-btn" onClick={onAssignMod}
                            style={{color: "#0054fc"}}
                        >
                            Assign Mod
                        </div>
                    </>
                    :
                    null
                }
                
                { is_staff ?
                    
                    <div className="" onClick={onBanFromLoner}>
                        Ban User from loner
                    </div>

                    :
                    null
                }
            </div>
        </div>
    )

}