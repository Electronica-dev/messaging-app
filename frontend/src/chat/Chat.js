import React, { useEffect, useRef } from 'react';
import useState from 'react-usestateref';
import ChannelList from './components/channel/ChannelList';
import './chat.css';
import MessagePanel from './components/message/MessagePanel';
import { io }  from "socket.io-client";
import axios from 'axios';

const SERVER = "http://localhost:8080";

const socket = io.connect(SERVER, { transports: ["websocket"] });

function Chat() {

  const [room, setRoom] = useState();
  const [rooms, setRooms] = useState();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [messages, setMessages] = useState();

  useEffect(() => {
    configureSocket()
  }, [])

  useEffect(() => {
    console.log('getdata useeffect (room)');
    getData()
  }, [room])

  useEffect(() => {
    console.log('socket useffect (room, rooms)');
    getData()
    socket.on('connection', () => {
      if(room) {
        handleChannelSelect(room.id)
      }
    });
    // configureSocket()
  }, [room])

  // useEffect(() => {
  //   // configureSocket()
  // }, [room, rooms])

  const configureSocket = () => {
    // let socket = io(SERVER)
    // socket.on('connection', () => {
    //   if(room) {
    //     handleChannelSelect(room.id)
    //   }
    // });
    socket.on('room', async (room) => {
      let temp_rooms = rooms
      console.log('temprooms inside room', temp_rooms); //returning null
      if(!loading) {
        temp_rooms.forEach(c => {
          if(c.id === room.id) {
            c.participants = room.participants
          }
        })
        setRooms(rooms)
      }
      await getData()
      //TODO: State not being updated correctly
      // setRooms(channelsRef.current)
    })

    socket.on('message', async message => {
      // await getData()
      //   .then(() => {
          let temp_rooms = rooms
          // let temp_channels = channelsRef.current
          console.log('rooms again boss', temp_rooms);
          if(loading) {
            
          }
          if(!loading) {
            console.log('inside not loading on message');
            temp_rooms.forEach(c => {
              if (c.id === message.room_id) {
                if (!c.messages) {
                  c.messages = [message];
                  setMessages(message)
                } else {
                  c.messages.push(message);
                  setMessages(message)
                }
              }
              setRooms(temp_rooms)
            // console.log('room with mesage', c);
            })
            // await getData()
          }
          getData()
          // setRoom(room)
          // channelsRef.current = temp_channels
          // setRooms(temp_rooms)
        // })
    })

    socket.on('customer-message', async message => {
      console.log('customer-message-chatgpt', message);
      let temp_rooms = rooms
      if(!loading) {
        temp_rooms.forEach(c => {
          if (c.id === message.room_id) {
            console.log('customer-message-chatgpt', c.id, message.room_id);
            if (!c.messages) {
              c.messages = [message];
              setMessages(message)
            } else {
              c.messages.push(message);
              setMessages(message)
            }
          }
        });
        setRooms(temp_rooms);
      }
      await getData()
    });
    // ssocket.current = socket
  }

  const handleSendMessage = (room_id, text) => {
    socket.emit('send-message', { room_id, text, senderName: socket.id, id: Date.now()})
  }

  const handleChannelSelect = (id) => {
    const room = rooms.find(c => {
      return c.id === id;
    });
    setRoom(room);
    // console.log('room state after selecting a room', room);
    socket.emit('room-join', id);
  }

  const getData = async () => {
    try {
      const response = await axios.get(
        `http://127.0.0.1:8080/getChannels`
      )
      // console.log('inside getData', response.data);
      setRooms(response.data.channels)
      // console.log(room);
      setError(null);
    } catch (err) {
      setError(err.message);
      setRoom(null);
    } finally {
      setLoading(false);
    }
  };

  const loadChannels = async () => {
    await fetch('http://localhost:8080/getChannels')
      .then(async response => {
        const data = await response.json()
        console.log('data inside loadchannels', data.rooms);
        //TODO: Maybe the correct way to mutate state
        setRooms(data.rooms)
        // channelsRef.current = data.rooms
      })
    console.log(room, rooms);
  }

  return (
    <div className="chat-app">
      <ChannelList rooms={rooms} onSelectChannel={handleChannelSelect}></ChannelList>
      <MessagePanel onSendMessage={handleSendMessage} room={room}/>
    </div>
  );
}

export default Chat;