import React from 'react';
import Channel from './Channel';

function ChannelList(props) {
  const handleClick = (id) => {
    props.onSelectChannel(id);
  }

  console.log('inside channellist component', props.rooms); //returns the set of rooms received from props

  let list = <div className="no-content-message">There are no rooms to show</div>;
  if (props.rooms && props.rooms.map) {
    list = props.rooms.map(c =>
      <Channel
        key={c.id}
        id={c.id}
        name={c.name}
        participants={c.participants}
        onClick={handleClick}
      />
    );
  }

  return (
    <div className='channel-list'>
      {list}
    </div>
  );

}

export default ChannelList;