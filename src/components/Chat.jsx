import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { createSocketConnection } from '../utils/socket';
import axios from 'axios';
import { BASE_URL } from '../utils/constants';

const Chat = () => {
  const { targetUserId } = useParams();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const user = useSelector(store => store?.user);
  const userId = user?._id;

  const navigate = useNavigate();

  const fetchMessages = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/chat/${targetUserId}`, {
        withCredentials: true
      });
      const messages = res?.data?.data?.messages?.map(msg => {
        const { senderId, text, createdAt } = msg;
        const time = new Date(createdAt).toLocaleString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: true
        });
        return {
          firstName: senderId?.firstName,
          lastName: senderId?.lastName,
          text,
          time
        }
      });
      setMessages(messages);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  useEffect(() => {
    if (!userId) {
      return;
    }
    if ((targetUserId === userId) || !targetUserId) {
      navigate("/connections", {
        replace: true
      });
    }
    const socket = createSocketConnection();

    socket.emit("joinChat", { firstName: user?.firstName, userId, targetUserId });

    socket.on("messageReceived", ({ firstName, text, time }) => {
      setMessages(prevMessages => [...prevMessages, { firstName, text, time }]);
    });

    return () => {
      socket.disconnect();
    }
  }, [userId, targetUserId]);



  const sendMessage = () => {
    if (!newMessage.trim()) {
      return;
    }
    const socket = createSocketConnection();

    const now = new Date();

    let hours = now.getHours();
    let minutes = now.getMinutes();
    const ampm = hours >= 12 ? 'pm' : 'am';
    // Convert to 12-hour format
    hours = hours % 12;
    hours = hours ? hours : 12; // hour '0' should be '12'

    // Add leading zeros
    hours = hours.toString().padStart(2, '0');
    minutes = minutes.toString().padStart(2, '0');

    const formattedTime = `${hours}:${minutes} ${ampm}`;

    socket.emit("sendMessage", {
      firstName: user?.firstName,
      userId,
      targetUserId,
      text: newMessage,
      time: formattedTime
    });
    setNewMessage("");
  };

  return (
    <div className="w-11/12 sm:w-1/2 bg-black mx-auto border border-gray-600 m-5 h-[70vh] flex flex-col">
      <h1 className="p-5 border-b border-gray-600">Chat</h1>
      <div className="flex-1 overflow-scroll p-5">
        {messages?.map((msg, index) => (
          <div key={index} className="chat chat-start">
            {/* <div className="chat-image avatar">
              <div className="w-10 rounded-full">
                <img
                  alt="Tailwind CSS chat bubble component"
                  src={user?.photoUrl}
                />
              </div>
            </div> */}
            <div className="chat-header">
              {msg?.firstName}
              <time className="text-xs opacity-50">{msg?.time}</time>
            </div>
            <div className="chat-bubble">{msg?.text}</div>
            {/* <div className="chat-footer opacity-50">Delivered</div> */}
          </div>
        ))}
      </div>
      <div className="p-5 border-t border-gray-600 flex items-center gap-2">
        <input
          className="flex-1 border border-gray-500 text-white rounded p-2"
          onChange={(e) => setNewMessage(e.target.value)}
          value={newMessage}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              sendMessage();
            }
          }}
        />
        <button className="btn bg-[#A600FF]" type='submit' onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
};

export default Chat;