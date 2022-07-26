import Main from "./pages/main"

import { TimedMessageModal, CookieConsentModal } from "./modals/info-modal";
import { useEffect, useState } from "react";
import Login from "./components/login-component";
import ThemeSwitcher from "./components/theme-switch";


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
			<ThemeSwitcher className="invisible"/>
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
