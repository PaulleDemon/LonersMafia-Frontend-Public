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
            return window.scrollY || document.documentElement.scrollHeight
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
            timeout = setTimeout(() => setDirection(null), 250)
            
            let st = getScrollTop(currentElement?currentElement:null) 
            let sh = getScrollLeft(currentElement?currentElement:null)
            
            if (st > lastScrollTop){
                setDirection("down")
            }

            else if(st < lastScrollTop){
                setDirection("up")
            }
            
            if (sh < lastScrollLeft){
                setDirection("left")
            }

            else if(sh > lastScrollLeft){
                setDirection("right")
            }
            
            lastScrollTop = st
            lastScrollLeft = sh

        }
        
        if (currentElement){

            currentElement.addEventListener("scroll", handleNavigation, false)
        }

        else{
            window.addEventListener("scroll", handleNavigation, false)
        }

        return () => {
            window.removeEventListener("scroll", handleNavigation, false)
            currentElement?.removeEventListener("scroll", handleNavigation)
        }

    }, [ref?.current])

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

    useEffect(() => {

        const handleResizeEvent = () => {
            
            console.log("scroll: ", window.innerHeight, document.body.scrollHeight)
            console.log("scroll2: ", window.innerWidth, document.body.scrollWidth)
            
            const scrollVertical = window.innerHeight !== document.body.scrollHeight
            const scrollHorizontal = window.innerWidth < document.body.scrollWidth
            
            console.log("scroll: ", scrollVertical)
            setScrollVisible({vertical: scrollVertical, horizontal: scrollHorizontal})

        }
        
        if (!element)
            window.addEventListener("resize", handleResizeEvent)

        return () => window.removeEventListener("resize", handleResizeEvent)
        

    }, [window.innerWidth, window.innerHeight, 
        document.body.scrollHeight, document.body.scrollWidth])
    
    useEffect(() => {

        const handleResizeEvent = () => {
            
            let scrollVertical = 0
            let scrollHorizontal = 0
            
            scrollVertical = element?.scrollHeight !== element.clientHeight
            scrollHorizontal = element?.scrollWidth < element.clientWidth
     
            setScrollVisible({vertical: scrollVertical, horizontal: scrollHorizontal})
        
        }

        if (element)
            element.addEventListener("resize", handleResizeEvent)

        return () => element?.removeEventListener("resize", handleResizeEvent)

    }, [element?.scrollHeight, element?.clientHeight,
        element?.scrollWidth, element?.clientWidth])

    return scrollVisible

}



function getWindowDimensions() {
    const { innerWidth: width, innerHeight: height } = window
    return {
      width,
      height
    }
  }

  
export default function useWindowDimensions() {
    const [windowDimensions, setWindowDimensions] = useState(getWindowDimensions())
  
    useEffect(() => {
      function handleResize() {
        setWindowDimensions(getWindowDimensions())

      }
  
      window.addEventListener('resize', handleResize)
      
      return () => window.removeEventListener('resize', handleResize)
    }, [])
  
    return windowDimensions
  }