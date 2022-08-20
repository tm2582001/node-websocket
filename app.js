const express = require("express");
const { WebSocketServer, WebSocket } = require("ws");
const app = express();

const wss = new WebSocketServer({
  port: 8081,
  clientTracking: true,
});

wss.on("connection", function connection(ws) {
  ws.on("message", function message(e) {
    const rawMessage = Buffer.from(e).toString();
    try {
      const { sender, message } = JSON.parse(rawMessage);
      // console.log(wss.clients);
      for (const client of wss.clients) {
        if (client.readyState === WebSocket.OPEN) {
          client.send(
            JSON.stringify({
              sender,
              message,
            })
          );
        }
      }
    } catch (e) {
      //  don't crash the server
    }
  });

  ws.on('close',()=>{
    
  })

  ws.send(
    JSON.stringify({
      sender: "system",
      message: "connection established",
    })
  );
});

app.use(express.static("public"));

const port = 8080;

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
