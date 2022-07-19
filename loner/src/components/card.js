import { memo, useState, useEffect } from "react"


export const SpaceCard = ({name, tag_line, icon, ...props}) => {

    return (
        <div className="space_card">

            <div className="dashboard-container">
                <img src={icon} alt="" className="jcon" />
            </div>
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
    )

}