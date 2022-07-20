import { useEffect, useState } from "react"
import { useInfiniteQuery } from "react-query"
import { useParams, useSearchParams } from "react-router-dom"

import { listSpaces } from "../apis/loner-apis"
import { SpaceCard } from "../components/card"



const SortComponent = (onOptionChange) => {

    return (
        <div className="">
            <div>Trending</div>
            <div>Recent </div>
            <div>Moderating</div>
        </div>
    )
}


/**
 * will display all the spaces according to the sorting
 */

const SpacePage = () => {
    
    const { sortParams } = useSearchParams()

    const [listQueries, setListQueries] = useState([])
    const [createSpaceModal, setShowCreatSpaceModal] = useState()


    const sortListQUery = useInfiniteQuery(["spaces", sortParams], listSpaces, {
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

            setListQueries(recent_data)
        }
    })



    return (
        <div className="">
            
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
                    

                    <div onClick={createSpace}>create space</div>
                </div>

            }
        </div>
    )

}