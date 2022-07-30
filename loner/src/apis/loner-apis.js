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


export const getUser = async (user) => {

    const config = getConfig()

    return await api.get(`/user/${user}/get/`, config)
}


export const updateUser = async ({formData, id}) => {

    const config = getFormConfig()
    return await api.put(`/user/${id}/update/`, formData, config)

} 


export const banUser = async (id) => {

    const config = getFormConfig()

    const body = JSON.stringify({
        id: id
    })
    
    return await api.post(`/user/ban/`, body, config)

}

/* ----------------------------------- login ----------------------------------- */

export const loginUser = async (data) => {

    const config = getFormConfig()
    
    return await api.post(`/user/login/`, data, config)
}

/* ----------------------------------- mafia endpoints --------------------------  */

export const createMafia = async (data) => {

    const config = getFormConfig()
    return await api.post(`/mafia/create/`, data, config)

}

export const updateMafia = async ({formData, id}) => {

    const config = getFormConfig()
    return await api.put(`/mafia/${id}/update/`, formData, config)

}


export const getMafia = async (mafia) => {

    // const [_, mafia] = queryKey
    const config = getConfig()
    return await api.get(`/mafia/${mafia}/get/`, config)
}


export const assignMod = async (data) => {

    const config = getConfig()
    const body = JSON.parse(data)

    return await api.post(`/mafia/assign-mod/`, body, config)
}


export const deleteMafia = async (mafia) => {

    const config = getConfig()

    return await api.delete(`/mafia/delete/${mafia}/`, config)
}


export const deleteAndBan = async ({data, deleteAll=false}) =>{
    /**
     * deletes the users message and bans them
     * deleteAll if set to True will delete all the users message
     */
    const config = getConfig()
    const body = JSON.stringify(data)
    
    return await api.post(`/mafia/delete-and-ban/?deleteAll=${deleteAll}`, body, config)
}

export const listMafias = async ({queryKey, pageParam=1}) => {

    let [_, sort, user] = queryKey
    const config = getConfig()

    if (user === null || user === undefined)
        user = ""
    
    if (sort === undefined)
        sort = ""

    return await api.get(`/mafia/list/?sort=${encodeURIComponent(sort)}&user=${encodeURIComponent(user)}&page=${pageParam}`, config)
}

/* ----------------------------------- messages endpoints ------------------------- */

export const getMessages = async ({queryKey, pageParam=1}) => {

    const [_, mafia] = queryKey

    const config = getConfig()
    return await api.get(`/mafia/${mafia}/messages/?page=${pageParam}`, config)
}

export const uploadChatMedia = async (data) => {

    const config = getFormConfig()
    
    return await api.post(`/mafia/message/create/`, data, config)

}

export const deleteMessage = async (msg_id) => {

    const config = getConfig()

    return await api.delete(`/mafia/message/delete/${msg_id}/`, config)
} 


/* ------------------------------ reaction endpoints ------------------------------ */

export const reactToMessage = async (data) => {

    const config = getConfig()
    const body = JSON.stringify(data)

    return await api.post(`/mafia/messages/react/`, body, config)
}


export const deleteReaction = async ({message, reaction}) => {

    const config = getConfig()

    return await api.delete(`/mafia/message/${message}/react/${encodeURIComponent(reaction)}/delete/`, config)
}