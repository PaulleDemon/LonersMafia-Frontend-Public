import { useMemo, useState } from "react";
import {Routes, Route, Navigate} from "react-router-dom";
import { Error404 } from "../error-pages/errors";


import Chat from "./chat-page"
import LonerPage from "./loner-page";
import MafiasPage from "./mafias-page";


function Main(){

	const user_name = useMemo(() => sessionStorage.getItem("user-name"), [sessionStorage.getItem("user-name")])
	const logged_in = useMemo(() => sessionStorage.getItem("loggedIn"), [sessionStorage.getItem("loggedIn")])

	useState(() => {

		console.log("Yes")

	}, [sessionStorage.getItem("user-name"), sessionStorage.getItem("loggedIn")])

	console.log("Logged in: ", sessionStorage.getItem("loggedIn"))
	return (
		<Routes>
			<Route path="/" exact element={<Navigate to="/loner" replace />} />

			<Route path="/mafias/" element={<MafiasPage />}/>
			<Route path="/mafia/:mafia" element={<Chat />}/>
			<Route path="/loner/:loner" exact element={<LonerPage />}/>
			
	
			<Route path="/loner" exact 
				element={(sessionStorage.getItem("loggedIn") === "true" ? 
								<Navigate  replace  to={`/loner/${user_name}`}/> : 
								<Navigate replace to={`/mafias/`} />)}/>
		

			<Route path="*" element={<Error404 />} />

		</Routes>
	)
}

export default Main