import './App.css';
import { io }  from "socket.io-client";
const SERVER = "http://localhost:8080";

function App() {
  const socket = io.connect(SERVER);

  return (
    <div className="App">
      something
    </div>
  );
}

export default App;
