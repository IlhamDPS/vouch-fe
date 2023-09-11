import "./App.css";
import io from "socket.io-client";
import { useState } from "react";
import Chat from "./Chat";
import axios from "axios";
import { Button, Form, Input, notification  } from 'antd';

const socket = io.connect("http://localhost:4000");

function App() {
  const [username, setUsername] = useState("");
  const [room, setRoom] = useState("");
  const [showChat, setShowChat] = useState(false);

  const joinRoom = (values) => {
    if (values.username !== "" && values.room !== "") {
      const roomData = {
        username: values.username,
        room: values.room,
      };

      setUsername(values.username);
      setRoom(values.room);

      axios
        .post("http://localhost:4000/api/check-username", roomData)
        .then((response) => {
          if (!response.data.exists) {
            socket.emit("join_room", roomData);
            setShowChat(true);
          } else {
            notification.error({
              message: "Username Exists",
              description: "The username already exists. Please choose a different username.",
            });
          }
        })
        .catch((error) => {
          console.error(error);
        });
    }
  };

  return (
    <div className="App">
      {!showChat ? (
        <div className="joinChatContainer">
          <h3>Join Chatroom</h3>
          <Form
            name="basic"
            style={{ maxWidth: 600 }}
            onFinish={joinRoom}
            autoComplete="off"
          >
            <Form.Item
              name="username"
              rules={[{ required: true, message: 'Please input your username!' }]}
            >
              <Input placeholder="Username"/>
            </Form.Item>

            <Form.Item
              name="room"
              rules={[{ required: true, message: 'Please input your room!' }]}
            >
              <Input placeholder="Room"/>
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit">
                JOIN
              </Button>
            </Form.Item>
          </Form>
        </div>
      ) : (
        <Chat socket={socket} username={username} room={room} setShowChat={setShowChat} />
      )}

          
    </div>
  );
}

export default App;
