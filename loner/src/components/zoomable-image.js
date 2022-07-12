import React, { useEffect } from "react";

import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import {ReactComponent as CLOSE} from "../static/svg/close.svg"


export default function ZoomableImage({src, onClose}){

    useEffect(() => {
        // disables scroll while zooming
        var keys = {37: 1, 38: 1, 39: 1, 40: 1};

        function preventDefault(e) {
            
            e?.preventDefault();
    
        }

        function preventDefaultForScrollKeys(e) {
            if (keys[e.keyCode]) {
                preventDefault(e);
                return false;
            }
        }

        var supportsPassive = false;

        try {
            window.addEventListener("test", null, Object.defineProperty({}, 'passive', {
                get: function () { supportsPassive = true; } 
            }));
        } catch(e) {}

        var wheelOpt = supportsPassive ? { passive: false } : false;
        var wheelEvent = 'onwheel' in document.createElement('div') ? 'wheel' : 'mousewheel';


        function disableScroll() {
            window.addEventListener('DOMMouseScroll', preventDefault, false); // older FF
            window.addEventListener(wheelEvent, preventDefault, wheelOpt); // modern desktop
            window.addEventListener('touchmove', preventDefault, wheelOpt); // mobile
            window.addEventListener('keydown', preventDefaultForScrollKeys, false);
        }
        
        // call this to Enable
        function enableScroll() {
            window.removeEventListener('DOMMouseScroll', preventDefault, false);
            window.removeEventListener(wheelEvent, preventDefault, wheelOpt); 
            window.removeEventListener('touchmove', preventDefault, wheelOpt);
            window.removeEventListener('keydown', preventDefaultForScrollKeys, false);
        }

        disableScroll()

        return () => {
            enableScroll()
        }
    
    }, [])

    return (

        <div className="zoomable-image-container">
            
            <CLOSE id="close-btn" onClick={onClose}/> 

                <TransformWrapper
                initialScale={1}
                initialPositionX={200}
                initialPositionY={100}
                centerOnInit={true}
                >
                    {({ zoomIn, zoomOut, resetTransform, ...rest }) => (
                        <React.Fragment>
            
                        <TransformComponent>
                        <div className="zoomable-img-container">
                            <img src={src} alt="test" />
                        </div>
                        </TransformComponent>
                    </React.Fragment>
                    )}
                </TransformWrapper>
            
        </div>

    )

}
