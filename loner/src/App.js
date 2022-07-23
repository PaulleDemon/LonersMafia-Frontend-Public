import Main from "./pages/main"
import Cookies from "js-cookie"

import { RegistrationModal } from "./modals/registration-modals";
import { TimedMessageModal, CookieConsentModal } from "./modals/info-modal";
import { useEffect, useState } from "react";
import { login } from "./apis/loner-apis";
import { useQuery } from "react-query";
import Login from "./components/login-component";


function App() {

	const [timedMessage, setTimedMessage] = useState("")
	const [showCookieModal, setShowCookieModal] = useState(false)

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
			<Login />
			{
				timedMessage ?

				<TimedMessageModal message={timedMessage} onTimeOut={() => setTimedMessage("")} />
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
