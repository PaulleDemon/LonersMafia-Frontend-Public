import { useEffect, useState } from "react"
import { useQuery } from "react-query"

import { loginUser } from "../apis/loner-apis"
import { RegistrationModal } from "../modals/registration-modals"
import { TimedMessageModal } from "../modals/info-modal"


export default function Login(){

	const [timedMessage, setTimedMessage] = useState("")
	const [showRegistrationModal, setShowRegistrationModal] = useState(false)

    useEffect(() => {

        if (!sessionStorage.getItem("user-id")){
			setShowRegistrationModal(true)
        }

    }, [])


	const onUserLoginRegSuccess = (data) => {
		localStorage.setItem("user-id", `${data.data.id}`)
		localStorage.setItem("user-name", `${data.data.name}`)
		setShowRegistrationModal(false)
	}

	const onUserLogRefFailure = (err) => {

		if (err.response?.status === 401)
			setShowRegistrationModal(true)
			
		else if (err.response?.status === 417)
			setTimedMessage("You have been banned from loners")
		
		else if (err.response?.status === 404){
			localStorage.removeItem("user-id")
			localStorage.removeItem("user-name")
		}
	
		else 
			setTimedMessage("An error occured trying to log you in.")

	}

    // const handleRegistrationSuccess = () => {
	// 	loginQuery.refetch()
	// 	setShowRegistrationModal(false)
	// }

    return(
        
        <>  

            {
				timedMessage ?

				<TimedMessageModal message={timedMessage} onTimeOut={() => setTimedMessage("")} />
				:

				null
			}

            {
            
                showRegistrationModal ?
                    <RegistrationModal onSuccess={onUserLoginRegSuccess} 
									   onError={onUserLogRefFailure}/>
                :
                null
            }
        </>
    )

}