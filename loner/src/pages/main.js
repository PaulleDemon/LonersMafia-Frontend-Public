import {Routes, Route, Navigate} from "react-router-dom";
import { Error404 } from "../error-pages/errors";


import Chat from "./chat-page"

function Main(){

	return (
		<Routes>
			<Route path="/" exact element={<Navigate to="/loner" replace />} />

			<Route path="/space/:space" element={<Chat />}/>
			<Route path="/loner" element={<Chat />}/>

			<Route path="*" element={<Error404 />} />

		</Routes>
	)
}

export default Main