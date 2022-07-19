import { useState, useEffect, useMemo } from "react"
import { useQuery } from "react-query"
import { useParams } from "react-router-dom"

import { getUser } from "../apis/loner-apis"
import { Error404 } from "../error-pages/errors"

import {ReactComponent as EDIT} from "../icons/edit.svg"
import {ReactComponent as SHARE} from "../icons/share.svg"

// import { default as logo } from "../icons/emoji.svg"


export default function LonerPage(){
    
    const {loner} = useParams()

    const [enabled, setEnabled] = useState(false)
    const [show404Page, setShow404Page] =useState(false)
    const [lonerData, setLonerData] = useState({
                                                id: null,
                                                name: "",
                                                avatar: "",
                                                tag_line: ""
                                            })
    
    const userid = useMemo(() => sessionStorage.getItem("user-id"), [sessionStorage.getItem("user-id")])

    useEffect(() => {
        
        if (loner)
            setEnabled(true)
    
    }, [loner])

    const lonerQuery = useQuery(["loner", loner], () => getUser(loner), {
        enabled: enabled,
        onSuccess: (data) => {

            setLonerData({
                id: data.data.id,
                name: data.data.name,
                avatar: data.data.avatar,
                tag_line: data.data.tag_line
            })
        },

        onError: (err) => {
            
            if (err.response.status === 404)
                setShow404Page(true)
        }
    })

    if (show404Page)
        return (
            <Error404 />
        )

    return (
        <div className="loner-home">

            <div className="dashboard">
            
               { 
                loner ?
                    <div className="avatar-container">
                        <img src={lonerData.avatar} alt="avatar" className="avatar" />
                    </div>
                :
                   null
                }
            </div>
            
            <div className="margin-top column center">
                <div className="row">
                    {loner ?
                        <>
                            <div className="">
                                {lonerData.name}
                            </div>
                           { 
                            userid == lonerData.id ?
                                <div className="edit-container">
                                    <EDIT className="edit"/>
                                </div>
                                :
                                null
                            }
                        </> 
                    :
                        <div className="btn">
                            Join Loners
                        </div>    
                    }
                </div>

                <div className="">
                    {lonerData.tag_line}
                </div>
                <div className="margin-10px">
                    <SHARE className="icon"/>
                </div>
            </div>

            <div>
                Trending spaces
            </div>

            <div>
                Your Recent spaces
            </div>

            <div>
                Spaces you moderate
            </div>

            <div>
                Promoted
            </div>

        </div>
    )
}