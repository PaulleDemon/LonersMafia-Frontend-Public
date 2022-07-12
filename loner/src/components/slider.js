import { useState, useEffect } from "react"


export default function Slider({value=1, min=1, max=100, step=1, onChange}){

    const [rangeValue, setRangeValue] = useState("")

    useEffect(() => {

        setRangeValue(value)

    }, [value])

    const onRangeChange = (e) => {
        setRangeValue(e.target.value)
        onChange(e.target.value)
    }

    return (
        <div className="slider__container">
            <input type="range"
                    min={min} 
                    max={max} 
                    value={rangeValue} 
                    step={step}
                    className="slider"
                    onChange={onRangeChange}
                />
        </div>
      )

}