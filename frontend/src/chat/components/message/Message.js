import React from "react";

function Message(props) {
  // console.log('inside message component', props);
  return (
    <div className="message-item">
      <div><b>{props.senderName}</b></div>
      <span>{props.text}</span>
    </div>
  )
}

export default Message;