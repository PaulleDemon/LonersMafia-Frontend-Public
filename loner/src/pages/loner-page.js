import { memo, useState, useEffect, useMemo, useRef } from "react"
import { useInfiniteQuery, useQuery } from "react-query"
import { useParams, Link } from "react-router-dom"

import { getUser, listSpaces } from "../apis/loner-apis"
import { CreateSpaceCard, SpaceCard } from "../components/card"
import { LoadingWheel } from "../components/loading"
import { Error404 } from "../error-pages/errors"

import {ReactComponent as EDIT} from "../icons/edit.svg"
import {ReactComponent as SHARE} from "../icons/share.svg"
import { BannedUserModal } from "../modals/info-modal"
import { SpaceCreateModal } from "../modals/registration-modals"
import { useScrollDirection } from "../utils/hooks"

// import { default as logo } from "../icons/emoji.svg"

/**
 * title: str - title of the section
 * data: Array - loads the data into the section
 * isLoading: bool - if set to true will show a loading wheel
 * onLoadable: function - function thats called when the scrollbar reaches to the end.
 */
const HorizontalSection = memo(({title, data=[], isLoading=false, onLoadable}) => {


    const scrollRef = useRef()
    const [showSpaceCreateModal, setShowSpaceCreateModal] = useState(false)

    const scrollDirection = useScrollDirection(scrollRef)

    // console.log(scrollRef.current?.scrollLeft, ((scrollRef.current?.scrollWidth - scrollRef.current?.clientWidth) - scrollRef.current?.scrollLeft))

    const handleScroll = (e) => {

        const current = e.target

        if (((current.scrollWidth - current.clientWidth) - current.scrollLeft) < 200 && scrollDirection === "right"){
            onLoadable()
            console.log("Loadable")
        }

    }

    return (
        <div className="section" >
            <div className="title-22px">
                {title}
            </div>
            
            {
             showSpaceCreateModal ?    
                <SpaceCreateModal onClose={() => setShowSpaceCreateModal(false)}
                                  onSuccess={() => setShowSpaceCreateModal(false)}
                />
                :
                null
            }

            <div className="space-cards-container" ref={scrollRef} onScroll={handleScroll}>
                {
                    data.map((data) => {

                        return (

                            <li key={data.id}>
                                <SpaceCard name={data.name} 
                                            tag_line={data.tag_line}
                                            icon={data.icon}
                                />
                            </li>

                        )
                    })
                        
                }
                
                <CreateSpaceCard onClick={() => setShowSpaceCreateModal(true)}/>

                {
                    isLoading ?

                        <LoadingWheel />
                    :

                    null
                }

            </div>
            <Link className="btn" to={'/spaces'}>
                see more
            </Link>
        </div>
    )

})



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
        staleTime: 30 * 60 * 1000,

        onError: (err) => {
            
            if (err.response.status === 404)
                setShow404Page(true)
        }
    })

    const trendingListQuery = useInfiniteQuery(["spaces", "trending", lonerData.id], listSpaces, {
        enabled: enabled,
        staleTime: 5 * 60 * 1000, // 5 minutes
        getNextPageParam: (lastPage, ) => {
            // console.log("PAGE: ", lastPage)
            if (lastPage.data.current < lastPage.data.pages){
                return lastPage.data.current + 1}
            
        }
    }) 


    const recentListQuery = useInfiniteQuery(["spaces", "recent", lonerData.id], listSpaces, {
        enabled: enabled,
        getNextPageParam: (lastPage, ) => {
            // console.log("PAGE: ", lastPage)
            if (lastPage.data.current < lastPage.data.pages){
                return lastPage.data.current + 1}
            
        },
        // staleTime: Infinity,
        // refetchOnMount: true,
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
        staleTime: 5 * 60 *1000, // 5 minutes
        refetchOnMount: true,

    })

    useEffect(() => {

        if (lonerQuery.isSuccess || lonerQuery.isFetched){
            const data = lonerQuery.data
            setLonerData({
                id: data.data.id,
                name: data.data.name,
                avatar: data.data.avatar,
                tag_line: data.data.tag_line
            })
        }

    }, [lonerQuery.isSuccess, lonerQuery.isFetched])

    useEffect(() => {
        console.log("Fetxhed: ", trendingListQuery.isFetched)
        if (trendingListQuery.isSuccess || trendingListQuery.isFetched){

            const data = trendingListQuery.data

            let trending_data=[]

            data.pages.forEach((x) => {
                x.data.results.forEach( (x) =>{
                    trending_data.push(x)
                }
                )      
            })

            setTrendingSpace(trending_data)

        }

    }, [trendingListQuery.status])

    useEffect(() => {

        if (moderatingListQuery.isSuccess){
            
            const data = moderatingListQuery.data

            let moderating_data=[]

            data.pages.forEach((x) => {
                x.data.results.forEach( (x) =>{
                    moderating_data.push(x)
                }
                )      
            })
            console.log("Success", moderating_data)
            setModeratingSpaces(moderating_data)

        }

    }, [moderatingListQuery.status])

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

                <HorizontalSection  title="Recently texted spaces" 
                                    data={recentSpaces}
                                    isLoading={recentListQuery.isLoading||recentListQuery.isFetching}
                                    onLoadable={()=>recentListQuery.fetchNextPage({cancelRefetch: false})}
                                    />
                <HorizontalSection  title="Trending spaces" 
                                    data={trendingSpaces}
                                    isLoading={trendingListQuery.isLoading||trendingListQuery.isFetching}
                                    onLoadable={()=>trendingListQuery.fetchNextPage({cancelRefetch: false})}
                                    />
                <HorizontalSection title="Moderating spaces" 
                                   data={moderatingSpaces}
                                   isLoading={moderatingListQuery.isLoading||moderatingListQuery.isFetching}
                                   onLoadable={()=>moderatingListQuery.fetchNextPage({cancelRefetch: false})}
                                   />


                <div className="section">
                    <div className="title">
                        Sponsor
                    </div>

                    <div className="space-cards-container">

                    </div>

                </div>

            </div>
            
            <div className="row center">
                <a href="http://" target="_blank" rel="noreferrer" className="font-18px margin-10px">View source on Github</a>
                <a href="http://" target="_blank" rel="noreferrer" className="font-18px margin-10px">Report a bug</a>
            </div>

        </div>
    )
}