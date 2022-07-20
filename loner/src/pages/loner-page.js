import { useState, useEffect, useMemo } from "react"
import { useInfiniteQuery, useQuery } from "react-query"
import { useParams } from "react-router-dom"

import { getUser, listSpaces } from "../apis/loner-apis"
import { CreateSpaceCard, SpaceCard } from "../components/card"
import { Error404 } from "../error-pages/errors"

import {ReactComponent as EDIT} from "../icons/edit.svg"
import {ReactComponent as SHARE} from "../icons/share.svg"
import { BannedUserModal } from "../modals/info-modal"
import { SpaceCreateModal } from "../modals/registration-modals"

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
    
    const [trendingSpaces, setTrendingSpace] = useState([])
    const [recentSpaces, setRecentSpaces] = useState([])
    const [moderatingSpaces, setModeratingSpaces] = useState([])

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

    const trendingListQuery = useInfiniteQuery(["spaces", "trending", lonerData.id], listSpaces, {
        enabled: enabled,
        getNextPageParam: (lastPage, ) => {
            // console.log("PAGE: ", lastPage)
            if (lastPage.data.current < lastPage.data.pages){
                return lastPage.data.current + 1}
            
        },
        staleTime: Infinity,
        onSuccess: (data) => {
            console.log("data: ", data)

            let trending_data=[]

            data.pages.forEach((x) => {
                x.data.results.forEach( (x) =>{
                    trending_data.push(x)
                }
                )      
            })

            setTrendingSpace(trending_data)
        }
    }) 


    const recentListQuery = useInfiniteQuery(["spaces", "recent", lonerData.id], listSpaces, {
        enabled: enabled,
        getNextPageParam: (lastPage, ) => {
            // console.log("PAGE: ", lastPage)
            if (lastPage.data.current < lastPage.data.pages){
                return lastPage.data.current + 1}
            
        },
        staleTime: Infinity,

        onSuccess: (data) => {
            let recent_data=[]

            data.pages.forEach((x) => {
                x.data.results.forEach( (x) =>{
                    recent_data.push(x)
                }
                )      
            })

            setRecentSpaces(recent_data)
        }

    })

    const moderatingListQuery = useInfiniteQuery(["spaces", "moderating", lonerData.id], listSpaces, {
        enabled: enabled,
        getNextPageParam: (lastPage, ) => {
            // console.log("PAGE: ", lastPage)
            if (lastPage.data.current < lastPage.data.pages){
                return lastPage.data.current + 1}
            
        },
        staleTime: Infinity,
        onSuccess: (data) =>{
            let recent_data=[]

            data.pages.forEach((x) => {
                x.data.results.forEach( (x) =>{
                    recent_data.push(x)
                }
                )      
            })

            setModeratingSpaces(recent_data)
        }
    })

    if (show404Page)
        return (
            <Error404 />
        )

    return (
        <div className="loner-home">
            
            <div className="dashboard">

                <div>
                    Create Space
                </div>

                { 
                loner ?
                    <div className="avatar-container">
                        <img src={lonerData.avatar} alt="avatar" className="avatar" />
                    </div>
                :
                null
                }
            </div>
           
            <SpaceCreateModal />
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
                
            <div className="section-container">

                <div className="section">
                    <div className="title-22px">
                        Recently texted spaces
                    </div>
                    
                    <div className="space-cards-container">
                        <SpaceCard />
                        <SpaceCard />
                        <CreateSpaceCard />
                    </div>
                        
                </div>

                <div className="section">
                    <div className="title-22px">
                        Trending spaces
                    </div>
                    
                    <div className="space-cards-container">
                        <SpaceCard />
                    </div>

                </div>

                <div className="section">
                    <div className="title-22px">
                        Moderating spaces
                    </div>
                    
                    <div className="space-cards-container">
                        <SpaceCard />
                    </div>

                </div>

                <div className="section">
                    <div className="title">
                        Sponsor
                    </div>

                    <div className="space-cards-container">

                    </div>

                </div>

            </div>
        </div>
    )
}