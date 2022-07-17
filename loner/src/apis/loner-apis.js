import axios from "axios"

/**
 * contains endpoints
 */

 const api = axios.create({
    baseURL: process.env.REACT_APP_API_ENDPOINT,
})


const getConfig = () => {

    
    const config = {
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
        }
    }
   
    return config

}


const getFormConfig = () => {

    const config = {
        headers: {
            "Content-Type": "multipart/form-data",
            "Accept": "application/json"
        }
    }

    return config

}

/* ------------------------ User endpoints ---------------------- */

// End point to create the user
export const createUser = async (form_data) => {

    const config = getFormConfig()


    return await api.post("/user/create/", form_data, config)

} 

export const upateUser = async (id, name, avatar) => {

    const config = getFormConfig()

    const body = JSON.stringify({
        body: body,
        avatar: avatar
    })

    return await api.post(`/user/update/${id}/`, body, config)

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
    return await api.post(`/space/create/`, data.formData, config)

}

export const updateSpace = async (data) => {

    const config = getFormConfig()
    return await api.post(`/space/update/`, data.formData, config)

}

export const deleteSpace = async (space) => {

    const config = getConfig()

    return await api.delete(`/space/delete/${space}/`, config)
}

/* ----------------------------------- messages endpoints ------------------------- */

export const getMessages = async ({queryKey, pageParam=1}) => {

    const [_, space] = queryKey

    const config = getConfig()
    return await api.get(`/space/${space}/messages/?page=${pageParam}`, config)
}

export const uploadChatMedia = async (data) => {

    const config = getFormConfig()
    return await api.post(`/space/${data.space}/message/create/`, data.formData, config)

}

export const reactToMessage = async (id, react) => {

    const config = getConfig()

    const body = JSON.stringify({
        react: react
    })

    return await api.post(`/space/message/${id}/react/`, body, config)

}

export const deleteReact = async (id) => {

    const config = getConfig()

    return await api.delete(`/messages/react/${id}/`, config)
}

export const deleteMessage = async (msg_id) => {

    const config = getConfig()

    return await api.delete(`/space/message/${msg_id}/`, config)
} 