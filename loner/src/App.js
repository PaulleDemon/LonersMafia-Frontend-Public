import Main from "./pages/main"
import Cookies from "js-cookie"

import { CookieConsentModal, RegistrationModal, TimedMessageModal } from "./modals/modals";
import { useEffect, useState } from "react";
import { login } from "./apis/loner-apis";
import { useQuery } from "react-query";


function App() {

	const [timedMessage, setTimedMessage] = useState("")
	const [showCookieModal, setShowCookieModal] = useState(false)
	const [showRegistrationModal, setShowRegistrationModal] = useState(false)

	const loginQuery = useQuery("login", login, {
		// enabled: false,
		staleTime: Infinity,
		cacheTime: 60 * 60 * 1000, // 1 hour
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

		if (localStorage.getItem("cookie-accept") !== "true")
			setShowCookieModal(true)

	}, [])

	const setCookie = () => {
		localStorage.setItem("cookie-accept", "true")
		setShowCookieModal(false)
    }

	return (
		<div className="App">
			<Main />

			{
				timedMessage ?

				<TimedMessageModal message={timedMessage} onTimeOut={() => setTimedMessage("")} />
				:

				null
			}

			{
				showRegistrationModal ? 
					<RegistrationModal onSuccess={() => setShowRegistrationModal(false)}/>
				:
				null
			}

			{
				showCookieModal ?
					<CookieConsentModal onCookieAccept={setCookie}/>
				:
				null
			}
		</div>
	);
}

export default App;
