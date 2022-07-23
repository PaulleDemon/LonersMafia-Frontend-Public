import { useEffect, useState } from "react"
import { useQuery } from "react-query"

import { login } from "../apis/loner-apis"
import { RegistrationModal } from "../modals/registration-modals"
import { TimedMessageModal } from "../modals/info-modal"


export default function Login(){

	const [timedMessage, setTimedMessage] = useState("")
	const [showRegistrationModal, setShowRegistrationModal] = useState(false)

    const loginQuery = useQuery("login", login, {
		enabled: showRegistrationModal,
		staleTime: Infinity,
		cacheTime: 60 * 60 * 1000, // 1 hour
		onSuccess: (data) => {
			// console.log("data: ", data.data.id)
			
			sessionStorage.setItem("user-id", `${data.data.id}`)
			sessionStorage.setItem("user-name", `${data.data.name}`)
			sessionStorage.setItem("loggedIn", "true")
		},
		onError: (err) => {
	
			if (err.response?.status === 401)
				setShowRegistrationModal(true)
			
			else if (err.response.status === 417)
				setTimedMessage("You have been banned from loners")

			else 
				setTimedMessage("An error occured trying to log you in.")
		},
		retry: (failureCount, err) => {

			if (err.response?.status === 401 || err.response?.status === 417)
				return false
			
			return 3
		}
		
	})

    useEffect(() => {

		console.log("Logged in? ", sessionStorage.getItem("loggedIn"))

        if (sessionStorage.getItem("loggedIn") !== "true"){
            setShowRegistrationModal(true)
        }

    }, [])

    const handleRegistrationSuccess = () => {
		loginQuery.refetch()
		setShowRegistrationModal(false)
	}

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
                    <RegistrationModal onSuccess={handleRegistrationSuccess} />
                :
                null
            }
        </>
    )

}