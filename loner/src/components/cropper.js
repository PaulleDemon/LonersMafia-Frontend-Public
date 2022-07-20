import React, { useRef, useState, useEffect } from "react"

import Cropper from 'react-easy-crop'
import Slider from "./slider";


const createImage = (url) =>
  new Promise((resolve, reject) => {
    const image = new Image()
    image.addEventListener('load', () => resolve(image))
    image.addEventListener('error', (error) => reject(error))
    image.setAttribute('crossOrigin', 'anonymous') // needed to avoid cross-origin issues on codeSandbox
    image.src = url
  })


function getRadianAngle(degreeValue) {
  return (degreeValue * Math.PI) / 180
}

/**
 * Returns the new bounding area of a rotated rectangle.
 */
export function rotateSize(width, height, rotation) {
  const rotRad = getRadianAngle(rotation)

  return {
    width:
      Math.abs(Math.cos(rotRad) * width) + Math.abs(Math.sin(rotRad) * height),
    height:
      Math.abs(Math.sin(rotRad) * width) + Math.abs(Math.cos(rotRad) * height),
  }
}

/**
 * This function was adapted from the one in the ReadMe of https://github.com/DominicTobias/react-image-crop
 */
export default async function getImageUrl(
    imageSrc,
    canvasRef,
    {croppedAreaPixels},
    rotation = 0,
    flip = { horizontal: false, vertical: false }
    ) {

    const image = await createImage(imageSrc)
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')

    if (!ctx) {
        return null
    }

    const rotRad = getRadianAngle(rotation)

    // calculate bounding box of the rotated image
    const { width: bBoxWidth, height: bBoxHeight } = rotateSize(
        image.width,
        image.height,
        rotation
    )

    // set canvas size to match the bounding box
    canvas.width = bBoxWidth
    canvas.height = bBoxHeight

    // translate canvas context to a central location to allow rotating and flipping around the center
    ctx.translate(bBoxWidth / 2, bBoxHeight / 2)
    ctx.rotate(rotRad)
    ctx.scale(flip.horizontal ? -1 : 1, flip.vertical ? -1 : 1)
    ctx.translate(-image.width / 2, -image.height / 2)

    // draw rotated image
    ctx.drawImage(image, 0, 0)

    // croppedAreaPixels values are bounding box relative
    // extract the cropped image using these values
    const data = ctx.getImageData(
        croppedAreaPixels.x,
        croppedAreaPixels.y,
        croppedAreaPixels.width,
        croppedAreaPixels.height
    )

    // set canvas width to final desired crop size - this will clear existing context
    canvas.width = croppedAreaPixels.width
    canvas.height = croppedAreaPixels.height

    // paste generated rotate image at the top left corner
    ctx.putImageData(data, 0, 0)

    // As Base64 string
    // return canvas.toDataURL('image/jpeg');

    // As a blob
    return new Promise((resolve, reject) => {
        canvas.toBlob((file) => {
            resolve(file)
        }, 'image/png')
    })
 
    }

/**
 * CropImage will crop to the image file given aspect, if round is set to True then it will display
 * it will round the crop display border.
 * 
 * imgFile: File - provide a image file not a url.
 * startCrop: bool - when set to true gives you the cropped image file
 * croppedImage: function - calls the function when the crop is complete it passes the image file as parameter
 * round: bool - rounds the crop display
 * aspect: number - provide a number to change the aspect ratio eg: 1 / 3
 * className: string(optional) - add a class 
 */

export const CropImage = ({imgFile=File, startCrop=false, croppedImage,  aspect=1, round=false, className=""}) => {

    const canvasRef = useRef()

    const [img, setImg] = useState("")

    const [crop, setCrop] = useState({
                                x: 0, 
                                y: 0
                            })
    
    const [zoom, setZoom] = useState(1)
    const [croppedAreaPixels, setCroppedAreaPixels] = useState({
                                                        width: 0,
                                                        height: 0
                                                        })
    
    useEffect(() => {

        if (imgFile){
            const img = URL.createObjectURL(imgFile)
            setImg(img)
        }

    }, [imgFile])
    
    useEffect(() => {

        if (startCrop)
            onCrop()

    }, [startCrop])

    const onCropChange = (crop) => {
        setCrop(crop)
      }
    
    const onZoomChange = (zoom) => {
        setZoom(zoom)
      }

    const onCropComplete = (croppedArea, croppedAreaPixels) => {

        setCroppedAreaPixels({
            croppedAreaPixels 
        })
    }

    const onReset = (e) => {
        e.preventDefault()

        setCrop({
            x: 0, 
            y: 0
        })

        setZoom(1)
    }

    const onCrop = async () => {
        
        if (!img){
            croppedImage(null)
            return
        }

        try {
            const croppedImageData = await getImageUrl(
                img,
                canvasRef,
                croppedAreaPixels,
            )
            
            const croppedFile = new File([croppedImageData], imgFile.name, {type: imgFile.type})
            // console.log("FILE: ", croppedFile)

            if (croppedImage)
                croppedImage(croppedFile)  
    
          } catch (e) {
                console.error(e)
          }

    }

    return (
        <div className={`cropper ${className}`}>
    
            <canvas ref={canvasRef} 
                width={croppedAreaPixels.width} 
                height={croppedAreaPixels.height}>
            </canvas>
            <div className="crop-container">
                {img ?
                        
                    <div className="crop">
                        <Cropper
                            image={img}
                            crop={crop}
                            zoom={zoom}
                            aspect={aspect}
                            cropShape={round ? "round": "rect"}
                            showGrid={false}
                            onCropChange={onCropChange}
                            onZoomChange={onZoomChange}
                            onCropComplete={onCropComplete}
                        />
                    </div>
                : 
                null
                }
            </div>
            <div className="cropper__controls">
                <Slider
                    value={zoom}
                    min={1}
                    max={3}
                    step={0.1}
                    onChange={(zoom) => onZoomChange(zoom)}
                />

            </div>
        </div>
      )

}
