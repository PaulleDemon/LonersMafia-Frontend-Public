import { useRef, useEffect, useState, useMemo, useCallback } from "react"
import { useInfiniteQuery } from "react-query"
import { useNavigate, useSearchParams } from "react-router-dom"
import useWebShare from "react-use-web-share"

import { SpaceCard } from "../components/card"
import { listSpaces } from "../apis/loner-apis"

import {ReactComponent as BACK} from "../icons/back.svg"
import {ReactComponent as SHARE} from "../icons/share.svg"

import { useScrollDirection } from "../utils/hooks"
import { LoadingWheel } from "../components/loading"
import { RegistrationModal, SpaceCreateModal } from "../modals/registration-modals"
import { TimedMessageModal } from "../modals/info-modal"


/**
 * 
 * @param values: Object - the sort values
 * @param onOptionChange: function - the function to be called when the option changes 
 * 
 */
const SortComponent = ({values, defaultValue, onOptionChange}) => {

    const ref = useRef()

    const [sort, setSort] = useState(values[defaultValue] || Object.values(values)[0])
    const [showDropDown, setShowDropDown] = useState(false)


    useEffect(() => {

        const handleClickOutside = (e) => {
            // if clicked outside then close the dropdown
            if (!ref.current?.contains(e.target)){
                setShowDropDown(false)
            }

        }

        window.addEventListener("click", handleClickOutside)

        return () => window.removeEventListener("click", handleClickOutside)

    }, [ref])

    const handleOptionChange = (data) => {

        if (onOptionChange)
            onOptionChange(data[0])
        
        setSort(data[1])
        setShowDropDown(false)
    }

    return (

        <div className="dropdown-container" ref={ref}>
            <div className="dropdown-btn sort-value" onClick={() => setShowDropDown(!showDropDown)}>
                {sort} ▾
            </div>
            {showDropDown ?
                
                <div className="dropdown sort-dropdown">
                    {Object.entries(values).map((data) => 
                       {
                        return (
                            <div className="dropdown-btn" key={data[0]} 
                                onClick={() => handleOptionChange(data)}>
                                {data[1]}
                            </div>
                        )
                    }

                    )}
                </div>
                :
                null
            }
        </div>
    )
}


/**
 * will display all the spaces according to the sorting
 */

const SpacesPage = () => {
    
    const [sortParams, setSortParam] = useSearchParams()

    const scrollRef = useRef()
    const history = useNavigate()
    
    const webShare = useWebShare()
    
    // const scrollVisible = useScrollBarVisible(null)
    const scrollDirection = useScrollDirection(null)

    const [listQueries, setListQueries] = useState([])
    const [showRegisterModal, setShowRegisterModal] = useState(false)
    const [createSpaceModal, setShowCreatSpaceModal] = useState(false)

    const [sortOption, setSortOption] = useState(sortParams.get("sort"))
    
    const [timedMessage, setTimedMessage] = useState("")

    const sortOptions = useMemo(() => {return (
            {"trending": "Trending", 
             "moderating": "Moderating",
             "recent": "Recent"
            })
        },
    [])

    const sortListQuery = useInfiniteQuery(["spaces", sortOption, sessionStorage.getItem("user-id")], listSpaces, {
        // enabled: enabled,
        getNextPageParam: (lastPage, ) => {
            // console.log("PAGE: ", lastPage)
            if (lastPage.data.current < lastPage.data.pages){
                return lastPage.data.current + 1}
            
        },
        staleTime: sortOption !== "recent" ? 5 * 60 * 1000 : 0,
        refetchOnMount: true,
        onSuccess: (data) => {
            let recent_data=[]

            data.pages.forEach((x) => {
                x.data.results.forEach( (x) =>{
                    recent_data.push(x)
                }
                )      
            })

            setListQueries(recent_data)
        }
    })


    useEffect(() => {
        // will update sort options based on the query parameters of the url
    
        if (["trending", "recent", "moderating"].includes(sortParams.get("sort")))
            setSortOption(sortParams.get("sort"))
        
        else{
            setSortOption(sortParams.get("trending"))
            setSortParam({"sort": "trending"})
        }

    }, [sortParams.get("sort")])

    useEffect(() => {
        // when the component is mounted fill the page with data
        if (sortListQuery.isSuccess){
                let recent_data=[]

                sortListQuery.data.pages.forEach((x) => {
                    x.data.results.forEach( (x) =>{
                        recent_data.push(x)
                    }
                    )      
                })

                setListQueries(recent_data)
            }
    }, [])

    useEffect(() => {
        // keep fetching next page until the srollbar appears or is at the end of page
        const difference = window.innerHeight - document.body.scrollHeight
      
        if (sortListQuery.status==="success" && [-1, 0, 1].includes(difference)){
            fetchNext()
        }
        
    }, [window.innerHeight, document.body.scrollHeight, 
        sortListQuery.status, sortListQuery.data, sortListQuery.isFetched])


    useEffect(() => {
        // add event listener to fetch next pages when scrolling down
        window.addEventListener("scroll", fetchNext, false)

        return () => window.removeEventListener("scroll", fetchNext)

    }, [scrollDirection, window.innerHeight, document.body.scrollHeight])

    const fetchNext = useCallback(() => {
        // fethes the next page only if the user is scrolling down or there is no scrollbar (to fill the page until the scrollbar appears)
        if ((scrollDirection === "down" || window.innerHeight === document.body.scrollHeight || (document.body.scrollHeight - (window.innerHeight + window.scrollY)) < 300)
         && (sortListQuery.hasNextPage === undefined || sortListQuery.hasNextPage === true)){
            
            sortListQuery.fetchNextPage({cancelRefetch: false})
        
        }
    }, [scrollDirection])
    

    const handleSortOptionChange = (value) => {
        // updates the dropdown and query params
        setSortOption(value)
        setSortParam({"sort": value})
        sortListQuery.remove()
        sortListQuery.refetch({cancelRefetch: true})
        setListQueries([])


    }

    const handleShare = () => {
        // handles the share format
        if (webShare.isSupported){
            webShare.share({
                title: "Hey there, here is your invitation to join the loners network",
                text: "Special invite for you to speak your mind out on loners network; completely anonymously, no email, no password, just anonymity.",
                url: process.env.REACT_APP_API_ENDPOINT
            })
        }
        else{
            // navigator.clipboard.writeText(process.env.REACT_APP_API_ENDPOINT)
            navigator.clipboard.writeText(window.location)
            setTimedMessage("Link copied to clipboard")
        }

    }

    const handleCreateSpace = () => {

        if (sessionStorage.getItem("loggedIn") === "true"){
            setShowCreatSpaceModal(true)
        }
        else{
            setShowRegisterModal(true)
        }

    }

    const onSpaceCreate = (data) => {
        history(`/space/${data.data.name}/`)
        setShowCreatSpaceModal(false)
    }

    return (
        <div className="spaces-page">
            

            <div className="spaces-header">
                <BACK className="icon" onClick={() => history('/loner')}/>
                <SortComponent values={sortOptions} defaultValue={sortOption} onOptionChange={handleSortOptionChange}/>
                
                <a onClick={handleCreateSpace}>create space</a>
                
                <div className="row center">
                    <SHARE className="icon" onClick={handleShare}/>
                </div>
            </div>

            {
                createSpaceModal ?
                    <SpaceCreateModal onSuccess={onSpaceCreate} onClose={() => setShowCreatSpaceModal(false)}/>
                :
                null
            }

            {
                showRegisterModal ?

                <RegistrationModal onSuccess={() => setShowRegisterModal(false)} />

                :

                null
            }

            {
                timedMessage ? 
                    <TimedMessageModal message={timedMessage} onTimeOut={() => setTimedMessage("")}/>
                :
                null
            }

            <div className="space-content-container" >
          
                <ul className="space-content" ref={scrollRef}>

                    {
                        listQueries.map((data) => {
                            return (
                                <li key={data.id}>
                                    <SpaceCard name={data.name} icon={data.icon} tag_name={data.tag_name}/>
                                </li>
                            )
                        })
                    }
                        
                </ul>
                {
                    (sortListQuery.status === "success" &&  listQueries.length === 0)?
                        <div className="row center">
                            <div>Seems nothings here. Why not create a space?</div>
                            <div onClick={handleCreateSpace}>create space</div>
                        </div>
                
                    :

                    null
                }   
                {
                    (sortListQuery.isLoading || sortListQuery.isFetching) ?
                        <LoadingWheel />
                        :
                        null
                    }   

            </div>
        
        </div>
    )

}


export default SpacesPage