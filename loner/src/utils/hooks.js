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

    const getScrollTop = (target) => {

        if (target){
            return target.scrollTop 
        }else{
            return window.scrollY || document.documentElement.scrollTop
        }

    }

    const getScrollLeft = (target) => {

        if (target){
            return target.scrollLeft 
        }else{
            return window.scrollX || document.documentElement.scrollLeft
        }

    }

    useEffect(() => {
        
        const currentElement = ref?.current

        let timeout = 0

        let lastScrollTop = getScrollTop(currentElement?currentElement:null)
        let lastScrollLeft = getScrollLeft(currentElement?currentElement:null)


        const handleNavigation = (e) =>{

            window.clearTimeout(timeout)
            timeout = setTimeout(() => setDirection(null), 100)

            let st = getScrollTop(currentElement?currentElement:null) 
            let sh = getScrollLeft(currentElement?currentElement:null)

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

/**
 * 
 * @param  ref - reference to the element 
 * returns of the scroll bar is visible
 */
export const useScrollBarVisible = (ref) => {

    const [scrollVisible, setScrollVisible] = useState({vertical: false, horizontal: false})

    const element = useMemo(() => ref?.current, [ref?.current])

    console.log("Element: ", element)
    useEffect(() => {

        if (element){

            const scrollVertical = element?.scrollHeight > element.clientHeight
            const scrollHorizontal = element?.scrollWidth > element.clientWidth

            setScrollVisible({vertical: scrollVertical, horizontal: scrollHorizontal})
        }
        console.log("Yaaa: ", window.innerHeight, document.body.scrollHeight)

    }, [element?.scrollHeight, element?.scrollWidth, window.innerHeight, document.body.scrollHeight])

    return scrollVisible

}