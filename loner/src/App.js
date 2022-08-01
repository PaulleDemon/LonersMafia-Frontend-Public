import Main from "./pages/main"

import { TimedMessageModal, CookieConsentModal } from "./modals/info-modal"
import { useEffect, useState } from "react"
import Login from "./components/login-component"
import ThemeSwitcher from "./components/theme-switch"


import {ReactComponent as BOT_ERROR} from "./icons/illustrations/bot-error.svg"


function App() {

	const [isBot, setIsBot] = useState(false)
	const [timedMessage, setTimedMessage] = useState("")
	const [showCookieModal, setShowCookieModal] = useState(false)

	useEffect(() => {

		if (localStorage.getItem("cookie-accept") !== "true")
			setShowCookieModal(true)

	}, [])

	useEffect(() => {

		// prevents takeover by webdrivers, Yes will not prevent smart people from using automation tools
		setIsBot(navigator.webdriver)

	}, [navigator.webdriver])

	const setCookie = () => {
		localStorage.setItem("cookie-accept", "true")
		setShowCookieModal(false)
    }

	if (isBot){
		return (
			<div className="row center">
				<BOT_ERROR />
			</div>
		)
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

export default App
