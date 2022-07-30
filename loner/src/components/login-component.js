import { useEffect, useState } from "react"
import { useQuery } from "react-query"

import { loginUser } from "../apis/loner-apis"
import { RegistrationModal } from "../modals/registration-modals"
import { TimedMessageModal } from "../modals/info-modal"


export default function Login(){

	const [timedMessage, setTimedMessage] = useState("")

	const [loginEnabled, setLoginEnabled] = useState(false)
	const [showRegistrationModal, setShowRegistrationModal] = useState(false)

    const loginQuery = useQuery("login", loginUser, {
		enabled: loginEnabled,
		staleTime: Infinity,
		cacheTime: 60 * 60 * 1000, // 1 hour
		onSuccess: (data) => {
			// console.log("data: ", data.data.id)
			
		},
		onError: (err) => {
			
			
		},
		retry: (failureCount, err) => {

			if (err.response?.status === 401 || err.response?.status === 417)
				return false
			
			return 3
		}
		
	})

	const onUserLoginRegSuccess = (data) => {

		sessionStorage.setItem("user-id", `${data.data.id}`)
		sessionStorage.setItem("user-name", `${data.data.name}`)
		sessionStorage.setItem("loggedIn", "true")
		setShowRegistrationModal(false)
	}

	const onUserLogRefFailure = (err) => {

		if (err.response?.status === 401)
			setShowRegistrationModal(true)
			
		else if (err.response?.status === 417)
			setTimedMessage("You have been banned from loners")
		
		else if (err.response?.status === 404){
			sessionStorage.clear()
		}
	
		else 
			setTimedMessage("An error occured trying to log you in.")

	}

    useEffect(() => {

		console.log("Logged in? ", sessionStorage.getItem("loggedIn"))

        if (sessionStorage.getItem("loggedIn") !== "true"){
            setLoginEnabled(true)
			setShowRegistrationModal(true)
        }

    }, [])

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