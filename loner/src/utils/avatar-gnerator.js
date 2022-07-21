import axios from"axios"
import { randInt, getRandomColor} from "./random-generator"
/**
 * Makes use of external free and open-source to generate avatars
 */

const AVATAR_APIS = {
    // "Joe Schmoe": (seed) => `https://joeschmoe.io/api/v1/${seed}`,
    "dicebear": (sprites, seed, bg) => `https://avatars.dicebear.com/api/${sprites}/${seed}.svg?background=${encodeURIComponent(bg)}`,
}
const config = { responseType: 'blob' }

const AttrFreeLicensedAvatars = ["avataaars", "bottts", "identicon", 
                                    "initials", "open-peeps", "pixel-art", "pixel-art-neutral"] // this are attribute free licensed 


const avatar_api_keys = Object.keys(AVATAR_APIS)

let axiosConfig = {
    headers: {'Access-Control-Allow-Credentials': true}
}

/**
 * providing a seed(name) will return an avatar
 */

export default async function randomAvatarGenerator(seed, showBgColor=true){

    const random_avatar_api = avatar_api_keys[randInt(0, avatar_api_keys.length - 1)]

    if (random_avatar_api === "dicebear"){
        
        const random_sprite = AttrFreeLicensedAvatars[randInt(0, AttrFreeLicensedAvatars.length - 1)]

        return await axios.get(AVATAR_APIS[random_avatar_api](random_sprite, seed, (showBgColor ? getRandomColor() : "#ffffff00") ), config)
                .then(res => res.data)
    }
    else{
        return await axios.get(AVATAR_APIS[random_avatar_api](seed), axiosConfig)
    }


}