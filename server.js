const express = require('express');
const app = express();

const server = require('http').createServer(app);
const websocket = require('ws');
const wss = new websocket.Server({ server:server });

wss.on('connection', function connection(ws) {
    console.log('New Connection!');
    ws.send('Connected Successfully!');
    ws.on('error', console.error);
    ws.on('message', function message(data) {
      console.log('received: %s', data);
      if (data == "clear"){
        wss.clients.forEach(function each(client) {
          if (client !== ws && client.readyState === websocket.OPEN) {
            client.send("clear");
          }
        });
      }

      else if (data == "undo"){
        wss.clients.forEach(function each(client) {
          if (client !== ws && client.readyState === websocket.OPEN) {
            client.send("undo");
          }
        });
      }

      else if (data == "redo"){
        wss.clients.forEach(function each(client) {
          if (client !== ws && client.readyState === websocket.OPEN) {
            client.send("redo");
          }
        });
      }

      else {
      wss.clients.forEach(function each(client) {
            if (client !== ws && client.readyState === websocket.OPEN) {
            if (data != "null"){
            client.send(data);}
            }
        });}
    });
  
    
  });

app.get('/', (req, res) => {
  res.send('Hello World!');
});

server.listen(3000, () => {
  console.log('Server started on Port:3000');
});