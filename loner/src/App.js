import Main from "./pages/main"
import Cookies from "js-cookie"

import { CookieConsentModal } from "./modals/modals";
import { useEffect, useState } from "react";
import { Login } from "./apis/loner-apis";


function App() {

	const [showCookieModal, setShowCookieModal] = useState(false)

	useEffect(() => {

		if (Cookies.get("cookie-accept") !== "true")
			setShowCookieModal(true)

		// TODO: Login set cookies
		const login = Login().then(
			(res) => {console.log("res: ", res);return res} 
		).catch(err => console.log("Error: ", err))
		console.log("Logged in: ", login)

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
