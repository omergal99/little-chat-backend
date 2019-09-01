const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

var app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);

app.use(cors({
  origin: ['http://localhost:3002'],
  credentials: true // enable set cookie
}));

app.use(bodyParser.json());
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', function (req, res) {
  res.send('Hello world')
});

io.on('connection', socket => {

  console.log('an user connected');

  socket.on('disconnect', function () {
    console.log('user disconnected');
  });

  socket.on('msg sent', (txt, from) => {
    console.log('we got msg:', txt, 'from', from)
    io.emit('chat new msg', txt, from);
  });

  socket.on('user type', (user) => {
    if (user) {
      console.log('user type something:', user)
      io.emit('other user type', user);
    } else {
      io.emit('other user type', '');
    }
  });

});

const port = process.env.PORT || 9090;
http.listen(port, () => console.log(`server on *:${port}`));