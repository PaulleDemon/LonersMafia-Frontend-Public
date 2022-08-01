import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './css/index.css'
import './css/mobile.css'

import reportWebVitals from './reportWebVitals'
import { BrowserRouter } from "react-router-dom"
import { QueryClient, QueryClientProvider } from "react-query"
import { ReactQueryDevtools } from "react-query/devtools"



// NOTE: the below will remove console output during production. If you want the console
// output please comment window.console.log = () => {}
if (process.env.NODE_ENV === 'production'){
    // when in production redefine console.log to an empty function so that the console.log is not displayed.

    if (!window.console){
        window.console = {} // if console doesn't exist create a dummy so error isn't raised
    }

    window.console.log = () => {} // in production we don't want to see console output.
    window.console.warn = () => {} // in production we don't want to see console output.
}

const dontTryErrors = [400, 401, 404, 403, 417]

const queryClientConfig = {

    defaultOptions: {
        queries: {
            retry: (failureCount, error) => {
                if (dontTryErrors.includes(error.response?.status) || error.response?.status >= 500) //dont retry if the page returns 404 or 400
                    return false 

                if (failureCount >= 3)
                    return false

                return true
            }
        },

        mutations: {
            retry: (failureCount, error) => {
                
                if (error.response?.status === 401){
                    // clear local storage if the session expires or is unauthorized
                    localStorage.removeItem("user-id")
                    localStorage.removeItem("user-name")
                }

				if (dontTryErrors.includes(error.response?.status) || error.response?.status >= 500) //dont retry if the page returns 404 or 400
				//dont retry if the page returns 404 or 400 or 403 or 401
                    return false 

                if (failureCount >= 3)
                    return false

                return true
            }
        }
    }

}


const queryClient = new QueryClient(queryClientConfig);

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
