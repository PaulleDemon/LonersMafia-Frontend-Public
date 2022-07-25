import { memo } from "react"
import { useNavigate } from "react-router-dom"

import {ReactComponent as CREATE} from "../icons/create.svg"

import ENDPOINTS from "../constants/url-endpoints"


/**
 * name: str - name of the mafia
 * tag_line: str -tag line of the mafia
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


export const CreateMafiaCard = ({message="start mafia", onClick}) => {

    return (
        <div className="mafia-card create-mafia-card-container" onClick={onClick}>
            <div className="create-mafia-card">
                <CREATE />
                <div className="row center font-18px">
                    {message}
                </div>
            </div>
        </div>

    )

}