import React, { useEffect, useRef } from "react"


/**
 * This text component expands upwards as the user types in the input.
 * Used to take input for chat app.
 * includes all the props available for textarea jsx(html) element
 */
const AutoHeightTextarea = ({  ...props }) => {
    const textareaRef = useRef(null)

    useEffect(() => {
        textareaRef.current.style.height = "0px"
        const scrollHeight = textareaRef.current.scrollHeight
        textareaRef.current.style.height = scrollHeight + "px"
    }, [props.value])

    return (
        <div className="autoresize-container">
            <textarea
                className="autoresize"
                ref={textareaRef}
                {...props}
                value={props.value}
                onChange={props.onChange}
            />
        </div>
    )
}

export default AutoHeightTextarea