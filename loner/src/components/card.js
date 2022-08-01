import { memo } from "react"
import { useNavigate } from "react-router-dom"

import {ReactComponent as CREATE} from "../icons/create.svg"

import ENDPOINTS from "../constants/url-endpoints"


/**
 * Displays name and icon of the maifa
 * 
 * @param name: str - name of the mafia
 * @param tag_line: str -tag line of the mafia
 * @param icon: str- url to the icon of the mafia
 * @param promoted_url: str - sponsors url
 * @param promoted: bool - if its promoted indicate its promoted
 */

export const MafiaCard = memo(({name="", tag_line="", icon="", 
                            promoted_url="", promoted=false, ...props}) => {

    const history = useNavigate()


    const handleNavigation = () => {

        if (!promoted)
            history(ENDPOINTS.mafiaview(name))

        else
            window.open(promoted_url, '_blank').focus()

    }

    return (
        <div className="mafia-card" onClick={handleNavigation}>

            <div className="mafia-avatar-container">
                <img src={icon} alt="" className="mafia-avatar" />
            </div>

            <div className="info-container column">
                <div className="name">
                    {name}
                </div>
                <div className="tag-line">
                    {tag_line}
                </div>

                <div className="btn">
                    take a peek
                </div>
            </div>
        </div>
    )

})


/**
 * 
 * @param message: str - the message that should be displayed on the plus icon card
 * @param onClick: function -  the function that should be executed when the card is clicked
 */
export const CreateMafiaCard = ({message="start mafia", onClick}) => {

    return (
        <div className="mafia-card create-mafia-card-container" onClick={onClick}>
            <div className="create-mafia-card">
                <CREATE className="create-icon"/>
                <div className="row center font-18px">
                    {message}
                </div>
            </div>
        </div>

    )

}