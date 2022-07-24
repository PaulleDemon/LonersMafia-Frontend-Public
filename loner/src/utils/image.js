

export const  getFileFromUrl = async (url, defaultType = 'image/jpeg') => {

    const response = await fetch(url)
    const data = await response.blob()

    console.log("data: ", data)
    return new File([data], url.split('#').shift().split('?').shift().split('/').pop(), {
      type: data.type || defaultType,
    })
}