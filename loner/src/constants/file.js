

export const FILE_TYPE_MAPPING = {
    'image/svg+xml': 'svg',
    'image/png': 'png',
    'image/jpg': 'jpg'
}


export const getFileType = (file) => {

	if(file.type.match("image.*"))
		return "image"

	if(file.type.match("video.*"))
		return "video"

	else
		return "others"

}

export const getFileSize = (file) => {
    // returns file size in  Mib
    return file.size / 1024 / 1024 // in MiB

}


export const getFileTypeFromUrl = (url) => {
	
	if(/\.(jpg|jpeg|png|webp|avif|gif|svg)$/.test(url))
		return "image"
	
	else if (/\.(mp4|m4v)$/.test(url))
		return "video"

	else 
		return "others"
}