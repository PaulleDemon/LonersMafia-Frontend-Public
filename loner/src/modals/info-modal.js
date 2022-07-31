
import { memo, useEffect, useMemo, useState } from "react"
import useWebShare from "react-use-web-share"

import Tabs from "../components/tabs"

import {ReactComponent as CLOSE} from "../icons/close.svg"
import {ReactComponent as SHARE} from "../icons/share.svg"
import {ReactComponent as EDIT} from "../icons/edit.svg"


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
                Your Maifa browser needs some Cookies, and I am giving it some.
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


export const ConfirmationModal = ({message, onYes, onNo}) => {
    
    return (
        <div className="modal-background">
            <div className="modal confirmation-modal column center">


                <div className="row">
                    {message}
                </div>

                <div className="row center margin-10px">
                    <div className="btn" onClick={onYes}>Yes</div>
                    <div className="btn" onClick={onNo}>No</div>
                </div>

            </div>
        </div>
    )

}


export const BannedUserModal = () => {

    return (
        <div className="modal-background" >
            <div className="modal center">

                <div className="title-22px margin-10px">
                    You have been banned form Loner
                </div>

                <img src={require("../icons/illustrations/banned-icon.png")} alt="" className="img"/>

                <div className="font-18px margin-10px">You have been banned for violating loners policy</div>
                <div>

                </div>
            </div>
        </div>
    
    )

}



const MafiaInfo = ({icon, tag_line, about}) => {

    return (
        <div className="column center" style={{width: "100%", marginTop: "10px"}}>

            <img src={icon} alt="" className="mafia-avatar"/>

            <div className="tag-line margin-10px">
                "{tag_line}"
            </div>

            <div className="margin-10px font-18px about">
                {about}
            </div>
        </div>
    )
}

const MafiaRules = ({rules=[]}) => {

    return (
        <div className="mafia-rules" style={{width: "100%", marginTop: "10px"}}>

            {
                rules.map(({rule, id}) => {
                    return (
                        <div className="rule" key={id}>
                            {rule}
                        </div>
                    )
                })
            }
            <div className="row center font-18px">
                Make sure you don't break these mafia rules in additional to Loners rules when in this maifa
            </div>
        </div>
    )

}


export const MafiaInfoModal = ({icon, name, tag_line, about, 
                                rules, mods, editable, onClose, onEdit}) =>{
   
    const tabs = useMemo(() => ([
        
        {
            tabName: "About",
            tabValue: "about",
            tabComponent: <MafiaInfo icon={icon} tag_line={tag_line} about={about}/>
        },

        {
            tabName: "Rules",
            tabValue: "rules",
            tabComponent: <MafiaRules rules={rules}/>
        }


    ]), [icon, tag_line, about, rules])


    return (
        <div className="modal mafia-info-modal">
            
            <div className="mafia-info-btns-container">
                <CLOSE className="icon left-end" onClick={onClose}/>
                {
                    editable ?
                    <EDIT className="icon right-end" onClick={onEdit}/>
                    
                    :
                    null
                    
                }
            </div>
            <div className="title-22px margin-10px">
                Welcome to {name} mafia
            </div>
            <Tabs tabs={tabs} tabContentClassName={"conten"}/>
            
        </div>
    )

}


export const ShareInviteModal = ({url, message, title, text, onClose}) => {

    const webShare = useWebShare()
    const [timedMesage, setTimedMessage] = useState("")

    const handleShare = () => {

        if (webShare.isSupported){
            webShare.share({
                title: title,
                text: text,
                url: url
            })
        }
        else{
            // navigator.clipboard.writeText(process.env.REACT_APP_API_ENDPOINT)
            navigator.clipboard?.writeText(url)
            setTimedMessage("Link copied to clipboard")
        }

    }

    return (
        <div className="modal center" style={{minWidth: "200px", minHeight: "100px"}}>

            {
                timedMesage !== ""?
                <TimedMessageModal message={timedMesage} timeout={2000} onTimeOut={() => setTimedMessage("")}/>
                :
                null
            }
            <CLOSE onClick={onClose} className="left-end icon"/>

            <div className="row center margin-10px">
                {message}
            </div>
            <SHARE onClick={handleShare} className="icon margin-10px"/>
        </div>
    )

} 