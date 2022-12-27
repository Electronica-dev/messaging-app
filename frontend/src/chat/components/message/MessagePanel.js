import React, { useState } from "react";
import Message from './Message';

function MessagePanel(props) {
  const [input, setInput] = useState('')
  console.log('messagepanel', props);

  const send = () => {
    if(input && input !== '') {
      props.onSendMessage(props.room.id, input);
      setInput('')
    }
  }

  const handleInput = (event) => {
    setInput(event.target.value)
  }

  let list = <div className="no-content-message">There are no messages.</div>
  if (props.room && props.room.messages) {
    list = props.room.messages.map(m =>
      <Message
        key={m.id}
        id={m.id}
        senderName={m.senderName}
        text={m.text}
      />
    )
  }
  return (
    <div className="messages-panel">
      <div className="meesages-list">{list}</div>
      {props.room &&
        <div className="messages-input">
          <input type="text" onChange={handleInput} value={input}/>
          <button onClick={send}>Send</button>
        </div>
      }
    </div>
  )
}

export default MessagePanel;