import { memo } from "react"
import { useNavigate } from "react-router-dom"

import {ReactComponent as CREATE} from "../icons/create.svg"

import ENDPOINTS from "../constants/url-endpoints"


/**
 * name: str - name of the space
 * tag_line: str -tag line of the space
 */

export const SpaceCard = memo(({name="", tag_line="", icon="", 
                            promoted_url="", promoted=false, ...props}) => {

    const history = useNavigate()


    const handleNavigation = () => {

        if (!promoted)
            history(ENDPOINTS.spaceview(name))

        else
            window.open(promoted_url,'_blank').focus()

    }

    return (
        <div className="space-card" onClick={handleNavigation}>

            <div className="dashboard-container">
                <img src={icon} alt="" className="dashboard" />
            </div>

            <div className="info-container column">
                <div className="name">
                    {name}
                </div>
                <div className="tag-line">
                    {tag_line}
                </div>

                <div className="btn">
                    take a peak
                </div>
            </div>
        </div>
    )

})


export const CreateSpaceCard = ({onClick}) => {

    return (
        <div className="space-card create-space-card-container" onClick={onClick}>
            <div className="create-space-card">
                <CREATE />
                <div className="row center font-18px">
                    create space
                </div>
            </div>
        </div>

    )

}