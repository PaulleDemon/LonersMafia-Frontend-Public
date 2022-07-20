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

        let timeout = 0

        let lastScrollTop = 0
        let lastScrollLeft = 0

        const handleNavigation = (e) =>{

            window.clearTimeout(timeout)
            timeout = setTimeout(() => setDirection(null), 100)

            let st = currentElement.scrollTop  
            let sh = currentElement.scrollLeft 

            if (st < lastScrollTop){
                setDirection("down")
            }

            else{
                setDirection("up")
            }

            if (sh < lastScrollLeft){
                setDirection("left")
            }

            else{
                setDirection("right")
            }

            lastScrollTop = st
            lastScrollLeft = sh

        }
        
        if (currentElement){

            currentElement.addEventListener("scroll", handleNavigation, false)
        }

        return () => currentElement?.removeEventListener("scroll", handleNavigation)

    }, [ref.current])

    return direction

}