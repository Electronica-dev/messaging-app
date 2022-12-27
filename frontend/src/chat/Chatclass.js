import React from 'react';
import ChannelList from './components/channel/ChannelList';
import './chat.css';
import MessagePanel from './components/message/MessagePanel';
import { io } from "socket.io-client";

const SERVER = "http://127.0.0.1:8080";

export class Chatclass extends React.Component {
  state = {
    rooms: null,
    room: null,
    id: null
  }

  socket;

  componentDidMount() {
    this.loadChannels();
    this.configureSocket();
  }

  // componentDidUpdate(prevProps) {
  //   if(this.props.room) {
  //     console.log('didupdate', this.props.room.messages);
  //     if (this.props.room.messages !== prevProps.room.messages) {
  //       this.loadChannels();
  //     }
  //   }

  // }

  configureSocket = () => {
    let socket = io(SERVER, { transports: ["websocket"] });

    socket.on('connection', () => {
      if (this.state.room) {
        this.handleRoomSelect(this.state.room.id);
      }
    });

    socket.on('room', room => {
      let rooms = this.state.rooms;
      rooms.forEach(c => {
        if (c.id === room.id) {
          c.participants = room.participants;
        }
      });
      this.setState({ rooms });
    });

    socket.on('message', message => {
      console.log('inside on message');
      let rooms = this.state.rooms
      rooms.forEach(c => {
        if (c.id === message.room_id) {
          console.log('message-chatclass', c.id, message.room_id);
          if (!c.messages) {
            c.messages = [message];
          } else {
            c.messages.push(message);
          }
        }
      });
      this.setState({ rooms });
    });

    socket.on('customer-message', message => {
      console.log('customer-message-chatclass', message);
      let rooms = this.state.rooms
      rooms.forEach(c => {
        if (c.id === message.room_id) {
          console.log('customer-message-chatclass', c.id, message.room_id);
          if (!c.messages) {
            c.messages = [message];
          } else {
            c.messages.push(message);
          }
        }
      });
      this.setState({ rooms });
    });

    this.socket = socket;
  }

  loadChannels = async () => {
    fetch('http://localhost:8080/getChannels').then(async response => {
      let data = await response.json();
      this.setState({ rooms: data.channels });
    })
  }

  handleRoomSelect = id => {
    let room = this.state.rooms.find(c => {
      console.log('handleroom', c.messages);
      return c.id === id;
    });
    this.setState({ room });
    this.setState({ id })
    this.socket.emit('room-join', id);
  }

  handleSendMessage = (room_id, text) => {
    this.socket.emit('send-message', { room_id, text, senderName: this.socket.id, id: Date.now() });
  }

  render() {
    return (
      <div className='chat-app'>
        <ChannelList rooms={this.state.rooms} onSelectChannel={this.handleRoomSelect} />
        <MessagePanel onSendMessage={this.handleSendMessage} room={this.state.room} />
      </div>
    );
  }
}