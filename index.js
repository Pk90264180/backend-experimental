const express = require('express');
const dotenv = require('dotenv')
const app = express();
const { Server } = require('socket.io');
const cors = require('cors');
require('./conn');
const Order = require('./schema');
const { db } = require('./schema');
app.use(cors());
app.use(express.json());
dotenv.config({ path: './.env' });
const PORT = process.env.PORT;

const io = new Server({
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
  },
});

io.on('connection', (socket) => {
  // console.log(`user connected to ${socket.id}`);
  socket.on('send_message', (data) => {
    console.log(data.message);
  });
});
app.get('/', (req, res) => {
  res.send('hello this is site I am running');
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
app.get('/api/item/:id', (req, res) => {});
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

app.listen(PORT, () => {
  console.log(`site is live at http://localhost:${PORT} `);
});
