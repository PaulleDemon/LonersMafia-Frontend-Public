import { useState, useMemo, useEffect } from "react"


/**
 * Hook that tells if the element is visible, pass in a ref
 */

export function useVisible(ref){

    const [isIntersecting, setIntersecting] = useState(false)

    const observer = useMemo(() => new IntersectionObserver(
        ([entry]) => setIntersecting(entry.isIntersecting)
        ), [ref])

    useEffect(() => {
        observer.observe(ref.current)
        // Remove the observer as soon as the component is unmounted
        return () => { observer.disconnect() }
    }, [])

    return isIntersecting

}

/**
 * Hook that detects scroll direction.
 * ref - pass reference to that element as paramter
 */
export const useScrollDirection = (ref) => {

    const [direction, setDirection] = useState(null)

    useEffect(() => {
        
        const currentElement = ref.current

        let lastScrollTop = window.scrollY || document.documentElement.scrollTop
        let lastScrollLeft = window.scrollX || document.documentElement.scrollLeft

        console.log("ref: ", ref.current)

        const handleNavigation = (e) =>{
            console.log("Navigation: ", e)
            let st = window.scrollY || document.documentElement.scrollTop //scroll top

            let sh = window.scrollX || document.documentElement.scrollLeft
            console.log("ST: ", st)

            if (st > lastScrollTop){
                console.log("down scroll")
                setDirection("down")
            }

            else{
                console.log("UP scroll")
                setDirection("up")
            }

            if (sh > lastScrollLeft){
                console.log("scroll left")
                setDirection("left")
            }

            else{
                console.log("scroll right")
                setDirection("right")
            }

            lastScrollTop = st <=0 ? 0 : st

        }

        if (currentElement){

            currentElement.addEventListener("scroll", handleNavigation)
        }

        return () => currentElement?.removeEventListener("scroll", handleNavigation)

    }, [ref.current])

    return direction

}