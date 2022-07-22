import { useMemo } from "react";
import {Routes, Route, Navigate} from "react-router-dom";
import { Error404 } from "../error-pages/errors";


import Chat from "./chat-page"
import LonerPage from "./loner-page";
import SpacesPage from "./spaces-page";


function Main(){

	const user_name = useMemo(() => sessionStorage.getItem("user-name"), [sessionStorage.getItem("user-name")])
	const logged_in = useMemo(() => sessionStorage.getItem("loggedIn"), [sessionStorage.getItem("loggedIn")])

	console.log("User_name: ", user_name, logged_in)

	return (
		<Routes>
			<Route path="/" exact element={<Navigate to="/loner" replace />} />

			<Route path="/spaces/" element={<SpacesPage />}/>
			<Route path="/space/:space" element={<Chat />}/>
			<Route path="/loner/:loner" exact element={<LonerPage />}/>
			
	
			<Route path="/loner" exact 
				element={(logged_in === "true" ? 
								<Navigate  replace  to={`/loner/${user_name}`}/> : 
								<Navigate replace to={`/spaces/`} />)}/>
		

			<Route path="*" element={<Error404 />} />

		</Routes>
	)
}

export default Main