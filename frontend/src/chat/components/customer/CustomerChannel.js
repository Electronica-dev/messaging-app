import React, { useEffect, useState } from "react";
import MessagePanel from "../message/MessagePanel";
import { useParams } from "react-router-dom";
import { io } from "socket.io-client";
import axios from "axios";

const SERVER = "http://127.0.0.1:8080";

const socket = io.connect(SERVER, { transports: ["websocket"] });

function CustomerChannel() {
  const { cid } = useParams()
  const [chatRoom, setchatRoom] = useState();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [messages, setMessages] = useState();
  const roomID = Number(cid)
  // let ssocket = useRef(null)
  // let cchannel = useRef(null)

  useEffect(() => {
    // getData()
    getChannelData()
    // console.log(error);
    // console.log(chatRoom);
    socket.on('connection', (id) => {
      socket.emit('room-join', roomID)
    })
  }, [])

  useEffect(() => {
    // getData()
    console.log('useeffect fired');
    // let socket = io(SERVER, { transports: ["websocket"] });


    socket.on('message', async message => {
      let channel = chatRoom;
      if(!loading) {
        if (!channel.messages) {
          channel.messages = [message];
          setMessages(message)
        } else {
          channel.messages.push(message)
          setMessages(message)
        }
        setchatRoom(channel)
      }
    })

    socket.on('customer-message', async message => {
      let room = chatRoom;
      console.log('should\'t be null but is', room);
      if(!loading) {
        console.log('SENT MESSAGE FROM CUSTOMERCHANNEL');
        if (!room.messages) {
          room.messages = [message];
          setMessages(message)
        } else {
          room.messages.push(message)
          setMessages(message)
        }
        setchatRoom(room)
      }
    })

    // ssocket.current = socket
  }, [chatRoom])

  const getData = async () => {
    try {
      const response = await axios.get(
        `http://127.0.0.1:8080/getChannels`
      )
      response.data.channels.forEach((ch) => {
        if(ch.id === roomID) {
          setchatRoom(ch)
        }
      })
      console.log(chatRoom);
      setError(null);
    } catch (err) {
      setError(err.message);
      setchatRoom(null);
    } finally {
      setLoading(false);
    }
  };

  const getChannelData = async () => {
    try {
      const response = await axios.get(
        `http://127.0.0.1:8080/customer/${cid}`
      )
      console.log('inside getChannelData', response.data);
      setchatRoom(response.data)
      console.log(chatRoom);
      setError(null);
    } catch (err) {
      setError(err.message);
      setchatRoom(null);
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = (room_id, text) => {
    socket.emit('send-customer-message', { room_id, text, senderName: room_id, id: Date.now() });
  }

  return (
    <div className="customer-channel">
      <MessagePanel onSendMessage={handleSendMessage} room={chatRoom}/>
    </div>
  )
}

export default CustomerChannel