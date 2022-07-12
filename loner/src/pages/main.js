import {Routes, Route, Navigate} from "react-router-dom";

import Chat from "./chat-page"

function Main(){

	return (
		<Routes>
			<Route path="/" exact element={<Navigate to="/spaces" replace />} />

			<Route path="/chat"
				element={<Chat />}
			>
			</Route>

		</Routes>
	)
}

export default Main