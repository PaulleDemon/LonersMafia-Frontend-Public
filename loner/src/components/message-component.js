import { memo, useState, useEffect } from "react";


const ChatCard = memo(({message, user, media, datetime, is_moderator=false, is_sender=false}) => {



    return (
        <div className={`chat-card`}>
            
            <div className="row" style={{gap: "5px"}}>
                <img className="user-icon" src="https://images.pexels.com/photos/3310695/pexels-photo-3310695.jpeg?cs=srgb&dl=pexels-ike-louie-natividad-3310695.jpg&fm=jpg" alt="" />
                <div className={`message-body ${is_sender ? "sender" : "receiver"}`}>
                    {"hello \n weiduio j\n\n\nweiwef oijw "}  
                </div>
            </div>

            <div className="row">

                <div className="username-time left-end">
                    6:40 pm
                </div>

                <div className="username-time right-end">
                    @{`Noob 2`}
                </div>

                {
                    
                }

            </div>
        </div>
    )

})


export default ChatCard