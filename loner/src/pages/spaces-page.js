import { useRef, useEffect, useState } from "react"
import { useInfiniteQuery } from "react-query"
import { useParams, useSearchParams } from "react-router-dom"

import { listSpaces } from "../apis/loner-apis"
import { SpaceCard } from "../components/card"


/**
 * 
 * @param values: Object - the sort values
 * @param onOptionChange: function - the function to be called when the option changes 
 * 
 */
const SortComponent = ({values, onOptionChange}) => {

    const ref = useRef()

    const [sort, setSort] = useState(Object.keys(values)[0])
    const [showDropDown, setShowDropDown] = useState(false)


    useEffect(() => {

        const handleClickOutside = (e) => {
            
            if (!ref.current?.contains(e.target)){
                setShowDropDown(false)
            }

        }

        window.addEventListener("click", handleClickOutside)

        return () => window.removeEventListener("click", handleClickOutside)

    }, [ref])

    const handleOptionChange = (val) => {
        console.log(val)

        if (onOptionChange)
            onOptionChange(val)
    
        setShowDropDown(false)
    }

    return (

        <div className="dropdown-container" ref={ref}>
            <div className="row center" onClick={() => setShowDropDown(!showDropDown)}>
                {sort} ▾
            </div>
            {showDropDown ?
                
                <div className="dropdown sort-dropdown">
                    {Object.entries(values).map((data) => 
                       { console.log("kets: ", data)
                    
                        return (
                            <div className="dropdown-btn" key={data[0]} onClick={() => handleOptionChange(data[0])}>
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
    
    const { sortParams } = useSearchParams()

    const [listQueries, setListQueries] = useState([])
    const [createSpaceModal, setShowCreatSpaceModal] = useState()


    const sortListQUery = useInfiniteQuery(["spaces", sortParams], listSpaces, {
        // enabled: enabled,
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

            setListQueries(recent_data)
        }
    })



    return (
        <div className="">
            
            <div className="row">
                <SortComponent values={{"trending": "Trending"}} />
            </div>
            {   listQueries ?
            
                <div>
                    {listQueries.map((data) =>

                        <li key={data.id}>
                            <SpaceCard />
                        </li>
                    
                    )}
                        
                
                </div>

                :

                <div className="row center">
                    
                    <div>Seems nothings here. Why not create a space?</div>
                    

                    <div>create space</div>
                </div>

            }
        </div>
    )

}


export default SpacesPage