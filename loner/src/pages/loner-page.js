import { memo, useState, useEffect, useMemo, useRef } from "react"
import { useInfiniteQuery, useQuery, useQueryClient } from "react-query"
import { useParams, Link, useNavigate } from "react-router-dom"

import useWebShare from "react-use-web-share"

import { getUser, listMafias } from "../apis/loner-apis"

import Login from "../components/login-component"
import { LoadingWheel } from "../components/loading"
import { CreateMafiaCard, MafiaCard } from "../components/card"
import { Error404 } from "../error-pages/errors"

import {ReactComponent as EDIT} from "../icons/edit.svg"
import {ReactComponent as SHARE} from "../icons/share.svg"

import { MaifaFormModal } from "../modals/mafia-form-modal"
import { RegistrationModal } from "../modals/registration-modals"
import { BannedUserModal, TimedMessageModal } from "../modals/info-modal"

import { useScrollDirection } from "../utils/hooks"
import ENDPOINTS from "../constants/url-endpoints"

import ThemeSwitcher from "../components/theme-switch"
// import { default as logo } from "../icons/emoji.svg"

/**
 * title: str - title of the section
 * data: Array - loads the data into the section
 * isLoading: bool - if set to true will show a loading wheel
 * onLoadable: function - function thats called when the scrollbar reaches to the end.
 */
const HorizontalSection = memo(({title, data=[], isLoading=false, onLoadable, sortType=""}) => {


    const scrollRef = useRef()
    const history = useNavigate()

    const [showRegisterModal, setShowRegisterModal] = useState(false)
    const [showMafiaCreateModal, setShowMafiaCreateModal] = useState(false)

    const scrollDirection = useScrollDirection(scrollRef)

    // console.log(scrollRef.current?.scrollLeft, ((scrollRef.current?.scrollWidth - scrollRef.current?.clientWidth) - scrollRef.current?.scrollLeft))

    const handleScroll = (e) => {

        const current = e.target

        if (((current.scrollWidth - current.clientWidth) - current.scrollLeft) < 200 && scrollDirection === "right"){
            onLoadable()
        }

    }

    const handleCreateMafia = () => {

        if (sessionStorage.getItem("loggedIn") === "true"){
            setShowMafiaCreateModal(true)
        }
        else{
            setShowRegisterModal(true)
        }

    }

    const onMafiaCreate = (data) => {
        history(ENDPOINTS.mafiaview(data.data.name))
        setShowMafiaCreateModal(false)
    }


    return (
        <div className="section" >
            <div className="title-22px">
                {title}
            </div>
            
            {
             showMafiaCreateModal ?    
                <MaifaFormModal onClose={() => setShowMafiaCreateModal(false)}
                           onSuccess={onMafiaCreate}
                />
                :
                null
            }


            {       
                showRegisterModal ?
                
                    <Login />

                :

                null
            }

            <div className="mafia-cards-container" ref={scrollRef} onScroll={handleScroll}>
                {
                    data.map((data) => {

                        return (

                            <li key={data.id}>
                                <MafiaCard name={data.name} 
                                            tag_line={data.tag_line}
                                            icon={data.icon}
                                />
                            </li>

                        )
                    })
                        
                }
                
                <CreateMafiaCard onClick={handleCreateMafia}/>

                {
                    isLoading ?

                        <LoadingWheel />
                    :

                    null
                }

            </div>
            <div className="right-end margin-10px">
                <Link to={`/mafias?sort=${sortType}`}>
                    see more {`>`}
                </Link>
            </div>
        </div>
    )

})



export default function LonerPage(){
    
    const {loner} = useParams()
    const webShare = useWebShare()

    const history = useNavigate()
    const queryClient = useQueryClient()

    const [enabled, setEnabled] = useState(false)
    const [show404Page, setShow404Page] =useState(false)
    const [timedMessage, setTimedMessage] = useState("")

    const [lonerData, setLonerData] = useState({
                                                id: null,
                                                name: "",
                                                avatar: "",
                                                tag_line: ""
                                            })
    
    const [trendingMafias, setTrendingMafias] = useState([])
    const [recentMaifas, setRecentMafia] = useState([])
    const [moderatingMafia, setModeratingMafia] = useState([])
    
    const [showRegisterModal, setShowRegisterModal] = useState(false)
    const [showUserEditModal, setShowUserEditModal] = useState(false)
    const [showMafiaCreateModal, setShowMafiaCreateModal] = useState(false)

    const userid = useMemo(() => sessionStorage.getItem("user-id"), [sessionStorage.getItem("user-id")])
    
    useEffect(() => {
        // if the loner id is available start fetching trending, modertaing mafias etc.
        if (lonerData.id !== null)
            setEnabled(true)
    
    }, [lonerData])

    const lonerQuery = useQuery(["loner", loner], () => getUser(loner), {
        staleTime: 30 * 60 * 1000,

        onError: (err) => {
            
            if (err.response.status === 404)
                setShow404Page(true)
        }
    })

    const trendingListQuery = useInfiniteQuery(["mafia", "trending", lonerData.id], listMafias, {
        enabled: enabled,
        staleTime: 5 * 60 * 1000, // 5 minutes
        getNextPageParam: (lastPage, ) => {
            // console.log("PAGE: ", lastPage)
            if (lastPage.data.current < lastPage.data.pages){
                return lastPage.data.current + 1}
            
        }
    }) 


    const recentListQuery = useInfiniteQuery(["mafia", "recent", lonerData.id], listMafias, {
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

            setRecentMafia(recent_data)
        }

    })

    const moderatingListQuery = useInfiniteQuery(["mafia", "moderating", lonerData.id], listMafias, {
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
        // sets the loner data.
        if ((lonerQuery.isSuccess || lonerQuery.isFetched) && lonerQuery.data){
            console.log("Problem")
            const data = lonerQuery.data
            setLonerData({
                id: data.data.id,
                name: data.data.name,
                avatar: data.data.avatar,
                tag_line: data.data.tag_line
            })
            console.log("Problem2")
        }

    }, [lonerQuery.isSuccess, lonerQuery.data])

    useEffect(() => {
      
        if (trendingListQuery.isSuccess || trendingListQuery.isFetched){

            const data = trendingListQuery.data

            let trending_data=[]

            data?.pages?.forEach((x) => {
                x.data?.results.forEach( (x) =>{
                    trending_data.push(x)
                }
                )      
            })

            setTrendingMafias(trending_data)

        }

    }, [trendingListQuery.status, trendingListQuery.data])

    useEffect(() => {

        // upon mount the moderating data is filled

        if (moderatingListQuery.isSuccess){
            
            const data = moderatingListQuery.data

            let moderating_data=[]

            data?.pages?.forEach((x) => {
                x.data?.results.forEach( (x) =>{
                    moderating_data.push(x)
                }
                )      
            })

            setModeratingMafia(moderating_data)

        }

    }, [moderatingListQuery.status, moderatingListQuery.data])

    const handleShare = () => {

        if (webShare.isSupported){
            webShare.share({
                title: loner ? `hey quick check out ${loner}` : "Check out whats on loners network",
                text: "Here is an invite for you to speak your mind out on loners network; completely anonymously, no email, no password, just anonymity.",
                url: window.location
            })
        }
        else{
            // navigator.clipboard.writeText(process.env.REACT_APP_API_ENDPOINT)
            navigator.clipboard.writeText(window.location)
            setTimedMessage("Link copied to clipboard")
        }

    }

    const onMafiaCreate = (data) => {
        history(ENDPOINTS.mafiaview(data.data.name))
        setShowMafiaCreateModal(false)
    }

    const onEditSuccess = (data) => {

        queryClient.setQueryData(["loner", loner], (cache_data) => {
            // update the cache
            return {
                data: {
                    ...cache_data.data,
                    avatar: data.data.avatar_url,
                    tag_line: data.data.tag_line,
                }
            }

        })

        setShowUserEditModal(false)
    }

    if (show404Page)
        return (
            <Error404 />
        )

    return (
        <div className="loner-home">


            {
                timedMessage ?
                    <TimedMessageModal message={timedMessage} onTimeOut={()=>setTimedMessage("")}/>
                    :
                    null
            }

            {
                showMafiaCreateModal ?

                    <MaifaFormModal onSuccess={onMafiaCreate}
                                        onClose={() => setShowMafiaCreateModal(false)}
                    />
                :

                null
            }

            {       
                showUserEditModal ?
                
                    <RegistrationModal 
                        onSuccess={onEditSuccess}
                        update={true}
                        userName={lonerData.name}
                        userAvatar={lonerData.avatar}
                        tagline={lonerData.tag_line}
                        onClose={() => setShowUserEditModal(false)}
                        />

                :

                null
            }

            <div className="dashboard">

                <div onClick={() => setShowMafiaCreateModal(!showMafiaCreateModal)} 
                    className="start-mafia-btn margin-10px">
                    Start Mafia
                </div>

                { 
                loner ?
                    <div className="avatar-container">
                        <img src={lonerData.avatar} alt="avatar" className="avatar" />
                    </div>
                :
                null
                }
            <ThemeSwitcher className="right-end"/>
            </div>
            <Login />
            
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
                                    <EDIT className="edit icon" onClick={() => setShowUserEditModal(true)}/>
                                </div>
                                :
                                null
                            }
                        </> 
                    :
                        <div className="btn" onClick={() => setShowRegisterModal(true)}>
                            {
                                showRegisterModal ?
                                    <Login />
                                :
                                null
                            }
                        </div>    
                    }
                </div>

                <div className="tag-line margin-10px">
                    "{lonerData.tag_line}"
                </div>
                <div className="margin-10px">
                    <SHARE className="icon" onClick={handleShare}/>
                </div>
            </div>
                
            <div className="section-container">

                <HorizontalSection  title="Recently texted mafias" 
                                    data={recentMaifas}
                                    isLoading={recentListQuery.isLoading||recentListQuery.isFetching}
                                    onLoadable={()=>recentListQuery.fetchNextPage({cancelRefetch: false})}
                                    sortType={"recent"}
                                    />

                <HorizontalSection  title="Trending mafias" 
                                    data={trendingMafias}
                                    isLoading={trendingListQuery.isLoading||trendingListQuery.isFetching}
                                    onLoadable={()=>trendingListQuery.fetchNextPage({cancelRefetch: false})}
                                    sortType={"trending"}
                                    />
                <HorizontalSection title="Moderating mafias" 
                                   data={moderatingMafia}
                                   isLoading={moderatingListQuery.isLoading||moderatingListQuery.isFetching}
                                   onLoadable={()=>moderatingListQuery.fetchNextPage({cancelRefetch: false})}
                                   sortType={"moderating"}
                                   />


                <div className="section">
                    <div className="title-22px">
                        Sponsored
                    </div>

                    <div className="mafia-cards-container" >
                        <MafiaCard name={"Peckspace"} 
                                    icon={require("../icons/sponsors-icons/peckspace.png")}
                                    tag_line={"Find your space on Peckspace"}
                                    promoted_url={"https://peckspace.com/spaces"}
                                    promoted={true}
                                    />
                        <CreateMafiaCard message="sponsor" onClick={() =>  window.open("https://github.com", '_blank').focus()}/>

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
