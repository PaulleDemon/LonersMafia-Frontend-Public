import axios from "axios"
import Cookies from "js-cookie"

/**
 * contains endpoints
 */

//  axios.defaults.xsrfHeaderName = "X-CSRFTOKEN"
//  axios.defaults.xsrfCookieName = Cookies.get("csrftoken")

//  axios.defaults.withCredentials = true

 const api = axios.create({
    baseURL: process.env.REACT_APP_API_ENDPOINT,
    withCredentials: true,
})


const getConfig = () => {

    
    const config = {
        headers: {
            "X-CSRFToken": Cookies.get("csrftoken"),
            "Content-Type": "application/json",
            "Accept": "application/json",
        },
    }
   
    return config

}


const getFormConfig = () => {

    const config = {
        headers: {
            "X-CSRFToken": Cookies.get("csrftoken"),
            "Content-Type": "multipart/form-data",
            "Accept": "application/json"
        },
        // withCredentials: true
    }

    return config

}

/* ------------------------ User endpoints ---------------------- */

// End point to create the user
export const createUser = async (form_data) => {

    const config = getFormConfig()


    return await api.post("/user/create/", form_data, config)

} 


export const getUser = async(user) => {

    const config = getConfig()

    return await api.get(`/user/${user}/get/`, config)
}

export const updateUser = async (formData) => {

    const config = getFormConfig()

    return await api.put(`/user/update/`, formData.data, config)

} 


export const banUser = async (id) => {

    const config = getFormConfig()

    const body = JSON.stringify({
        id: id
    })
    
    return await api.post(`/user/ban/`, body, config)

}

/* ----------------------------------- login ----------------------------------- */

export const login = async () => {

    const config = getConfig()
    return await api.get(`/user/login/`, config)
}

/* ----------------------------------- space endpoints --------------------------  */

export const createSpace = async (data) => {

    const config = getFormConfig()
    return await api.post(`/space/create/`, data, config)

}

export const updateSpace = async (data) => {

    const config = getFormConfig()
    return await api.post(`/space/update/`, data.formData, config)

}


export const getSpace = async (space) => {

    // const [_, space] = queryKey
    const config = getConfig()
    return await api.get(`/space/${space}/get/`, config)
}


export const assignMod = async (data) => {

    const config = getConfig()
    const body = JSON.parse(data)

    return await api.post(`/space/assign-mod/`, body, config)
}


export const deleteSpace = async (space) => {

    const config = getConfig()

    return await api.delete(`/space/delete/${space}/`, config)
}


export const deleteAndBan = async ({data, deleteAll=false}) =>{
    /**
     * deletes the users message and bans them
     * deleteAll if set to True will delete all the users message
     */
    const config = getConfig()
    const body = JSON.stringify(data)
    
    return await api.post(`/space/delete-and-ban/?deleteAll=${deleteAll}`, body, config)
}

export const listSpaces = async ({queryKey, pageParam=1}) => {

    let [_, sort, user] = queryKey
    const config = getConfig()

    if (user === null || user === undefined)
        user = ""
    
    if (sort === undefined)
        sort = ""

    return await api.get(`/space/list/?sort=${encodeURIComponent(sort)}&user=${encodeURIComponent(user)}&page=${pageParam}`, config)
}

/* ----------------------------------- messages endpoints ------------------------- */

export const getMessages = async ({queryKey, pageParam=1}) => {

    const [_, space] = queryKey

    const config = getConfig()
    return await api.get(`/space/${space}/messages/?page=${pageParam}`, config)
}

export const uploadChatMedia = async (data) => {

    const config = getFormConfig()
    
    return await api.post(`/space/message/create/`, data, config)

}

export const deleteMessage = async (msg_id) => {

    const config = getConfig()

    return await api.delete(`/space/message/delete/${msg_id}/`, config)
} 


/* ------------------------------ reaction endpoints ------------------------------ */

export const reactToMessage = async (data) => {

    const config = getConfig()

    console.log("Data: ", data)
    const body = JSON.stringify(data)

    return await api.post(`/space/messages/react/`, body, config)
}


export const deleteReaction = async (id) => {

    const config = getConfig()

    return await api.post(`/space/messages/react/${id}/delete/`, config)
}