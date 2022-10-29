const express = require('express');
const dotenv = require('dotenv');
const hbs = require('hbs');
const app = express();
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
require('./conn');
const Order = require('./schema');
const { db } = require('./schema');
app.use(cors());
app.use(express.json());
dotenv.config({ path: './.env' });
const PORT = process.env.PORT;
const server = http.createServer(app);
app.set('view engine', 'ejs');
const io = new Server(server, {
  cors: {
    origin: '*',
  },
});
io.on('connection', (socket) => {
  socket.on('send_message', (data) => {
    console.log(data.message);
    const chat = data.message;
    io.emit('send_message', chat);
  });
});

app.get('/', (req, res) => {
  res.send('this is homepage')
});
app.get('/api/item', (req, res) => {
  db.collection('orders')
    .find()
    .toArray(function (err, docs) {
      if (err) throw err;
      // console.log(docs);
      res.send(docs);
    });
});
app.post('/api/item', async (req, res) => {
  const {
    order_id,
    mobile,
    order_items,
    online_service_charge,
    total_quantity,
    total_price,
    time,
  } = req.body;
  if (!mobile || !order_items) {
    return res.status(422).json({ error: 'fill all feilds' });
  }
  try {
    const order = new Order({
      order_id: order_id,
      mobile: mobile,
      order_items: order_items,
      online_service_charge: online_service_charge,
      total_quantity: total_quantity,
      total_price: total_price,
      time: new Date().toString().slice(16, 21),
    });
    res.send('order palced successfully');
    const orderPlaced = order.save();
  } catch (err) {
    console.log(err);
  }
});

server.listen(PORT, () => {
  console.log(`site is live on http://localhost:${PORT}`);
});
