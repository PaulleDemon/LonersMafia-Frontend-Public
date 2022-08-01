import { useMemo, useState } from "react"
import {Routes, Route, Navigate} from "react-router-dom"
import { Error404 } from "../error-pages/errors"


import Chat from "./chat-page"
import LonerPage from "./loner-page"
import MafiasPage from "./mafias-page"

/**
 * Contains all the routes  
 */
function Main(){

	const user_name = useMemo(() => localStorage.getItem("user-name"), [localStorage.getItem("user-name")])
	const [loggedIn, setLoggedIn] = useState(localStorage.getItem("user-id") !== null)

	useState(() => {

		setLoggedIn(localStorage.getItem("user-id") !== null)

	}, [localStorage.getItem("user-name"), localStorage.getItem("user-id")])

	return (
		<Routes>
			<Route path="/" exact element={<Navigate to="/loner" replace />} />

			<Route path="/mafias/" element={<MafiasPage />}/>
			<Route path="/mafia/:mafia" element={<Chat />}/>
			<Route path="/loner/:loner" exact element={<LonerPage />}/>
			
	
			<Route path="/loner" exact 
				element={(loggedIn ? 
								<Navigate  replace  to={`/loner/${user_name}`}/> : 
								<Navigate replace to={`/mafias/`} />)}/>
		

			<Route path="*" element={<Error404 />} />

		</Routes>
	)
}

export default Main