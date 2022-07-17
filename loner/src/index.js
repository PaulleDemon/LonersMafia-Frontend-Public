import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './css/index.css'
import './css/mobile.css'

import reportWebVitals from './reportWebVitals'
import { BrowserRouter } from "react-router-dom"
import { QueryClient, QueryClientProvider } from "react-query";
import { ReactQueryDevtools } from "react-query/devtools";


const queryClient = new QueryClient();

const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(
	
	<BrowserRouter>
		<React.StrictMode>
			<QueryClientProvider client={queryClient} >
				{/* <ReactQueryDevtools initialIsOpen={false} /> */}
				<App />
			</QueryClientProvider>
		</React.StrictMode>
	</BrowserRouter>
	
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
