import Main from "./pages/main"
import Cookies from "js-cookie"

import { CookieConsentModal } from "./modals/modals";
import { useEffect, useState } from "react";

function App() {

	const [showCookieModal, setShowCookieModal] = useState(false)

	useEffect(() => {

		if (Cookies.get("cookie-accept") !== "true")
			setShowCookieModal(true)

	}, [])

	const setCookie = () => {
        Cookies.set("cookie-accept", "true")
		setShowCookieModal(false)
    }

	return (
		<div className="App">
			<Main />
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
