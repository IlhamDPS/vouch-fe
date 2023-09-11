import React, { useEffect, useState } from "react";
import ScrollToBottom from "react-scroll-to-bottom";
import { v4 as uuidv4 } from 'uuid';

function Chat({ socket, username, room, setShowChat }) {
  const [currentMessage, setCurrentMessage] = useState("");
  const [messageList, setMessageList] = useState([]);

  
  const sendMessage = async () => {
    if (currentMessage !== "") {
      const messageData = {
        id: uuidv4(),
        room: room,
        author: username,
        message: currentMessage,
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };

      await socket.emit("send_message", messageData);
      setMessageList((prevMessageList) => [...prevMessageList, messageData]);
      setCurrentMessage("");
    }
  };

  useEffect(() => {
    console.log("ini use effect")
    const listener = (data) => {
      if (!messageList.some((message) => message.id === data.id)) {
        setMessageList((prevMessageList) => [...prevMessageList, data]);
      }
    };

    socket.on("receive_message", listener);

    return () => socket.off("receive_message", listener);
  }, []);

  const handleExitClick = () => {
    setShowChat(false);
  };
  
  

  return (
    <div className="chat-window">
      <div className="chat-header">
        <p className="exit-text" onClick={handleExitClick}>Exit</p>
        <h2 className="room-text">{room}</h2>
        <p className="exit-text"></p>
      </div>
      <div className="chat-body">
        <ScrollToBottom className="message-container">
          {messageList.map((messageContent) => (
            <div
              className="message"
              id={`${username === messageContent.author ? "you" : "other"}`}
              key={messageContent.id}
            >
              {username !== messageContent.author && (
                <div className="message-meta">
                  <p id="author">{messageContent.author}</p>
                </div>
              )}
              <div className="message-content">
                <p>{messageContent.message}</p>
              </div>
              <div className="message-meta">
                <p id="time">{messageContent.time}</p>
              </div>
            </div>
          ))}
        </ScrollToBottom>
      </div>
      <div className="chat-footer">
        <input
          type="text"
          value={currentMessage}
          placeholder="Hey..."
          onChange={(event) => setCurrentMessage(event.target.value)}
          onKeyPress={(event) => event.key === "Enter" && sendMessage()}
        />
        <button onClick={sendMessage}>&#9658;</button>
      </div>
    </div>
  );
}

export default Chat;
