import { randInt } from "../utils/random-generator"

import {ReactComponent as ERROR} from "../icons/error-icons/error.svg"
import {ReactComponent as ERROR_404} from "../icons/error-icons/404/404page.svg"
import { Link } from "react-router-dom"


const ERROR_SVGS = [
    <ERROR />
]


export function getErrorCodeDescription(code, error_description){

    let error = {
        errorType: "", // brief description
        errorDescription: "" // longer description
    }

    if(code === "ERR_NETWORK" || error_description === "Network Error")
        error = {
            errorType: "Unable to connect to servers!",
            errorDescription: "Servers may be offline. Check back again later."
        }

    else if (error_description === "offline")
        error = {
            errorType: "You are not connected",
            errorDescription: "Make sure you have internet connected."
        }
    
    else if (code === 403)
        error = {
            errorType: "Forbidden",
            errorDescription: "You are not allowed to perform this action"
        }
            

    else if (code === 404 || error_description === "Request failed with status code 404")
        error = {
            errorType: "Page Not found",
            errorDescription: "Try searching for something else"
        }

        
    else if(code === 500)
        error = {
            errorType: "Server error",
            errorDescription: "An error occurred on our side please report this, if this persists."
        }


    else if(code === 502)
        error = {
            errorType: "Server error",
            errorDescription: "An error occurred on our side please report this. If this persists."
        }

    else if(code === 503)
        error = {
            errorType: "Service unavailable",
            errorDescription: "The service is currently unavailable. Try again after some time."
        }
    
    else
        error = {
            errorType: "Something went wrong!",
            errorDescription: "Try refreshing the page or try again later!!"
        }

    return error
          
}


export function BaseError(props){

    return (

        <div className="error-page">

            <p className="error-title title margin-4px">{props.errorType}</p>
            <p className="error-description margin-4px">{props.errorDescription}</p>

        </div>

    )

}


export function Error({error, retry=false, onRetry}){

    // console.log("ERROR CODE: ", error, error?.status)
    // console.log("ERROR CODE2: ", error?.message)

    // const corrected
    const {errorType, errorDescription} = getErrorCodeDescription(error?.status, (error?.message || error?.error?.message))

    return (
        <div className="error-page">
            <BaseError errorType={errorType} errorDescription={errorDescription}/>
            {
                retry ? 
                    <button onClick={onRetry} className="btn small">retry</button>
                :
                null
            }
        </div>
    )
}

const ERROR_404_IMG = ERROR_SVGS.concat([<ERROR_404 />])

const ERROR_404_DESC = [
                        "I doesn't exist just like you", 
                        "I don't exist just like your boner",
                        "I may not be hatched yet.",
                        "I love you 💘 :). But I don't exist. Now go back to home page",
                        "May be its time for you to go outside and meet real People",
                        "You may be the first person to stare at a 404 page for too long",
                        "You need help, just like me",
                        "Stop looking at a 404 page, Go back and chat Now!"
                    ]

export function Error404(){

    console.log("error: ", ERROR_404_IMG)

    return (
        <div className="error-page column center">

            <div className="row center">
                404
            </div>

            <div className="row center">
                {/* <img src={ERROR_404_IMG[randInt(0, ERROR_404_IMG.length-1)]} alt="" className="error-page-img" /> */}
                {ERROR_404_IMG[randInt(0, ERROR_404_IMG.length-1)]}
            </div>

            <div>
                {ERROR_404_DESC[randInt(0, ERROR_404_DESC.length-1)]}
            </div>

            <Link to="/" className="margin-10px btn"> Go Home :0</Link>
            
        </div>
    )

}
