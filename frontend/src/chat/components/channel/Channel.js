import React from 'react';

function Channel(props) {
  const click = () => {
    props.onClick(props.id);
  }

  return (
    <div className='channel-item' onClick={click}>
      <div>{props.name}</div>
      <span>{props.participants}</span>
    </div>
  )
}

export default Channel;