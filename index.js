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
  res.send([
    [
      { '/api/item - get': 'get all received order list' },
      { '/api/item - post': 'post all received order list' },
    ],
    [
      { '/api/item/order_id - get': 'get all received order list' },
      { '/api/item/order_id - patch': 'patch all received order list' },
    ],
    [
      { '/api/item/id/_id - get': 'get all received order list' },
      { '/api/item/id/_id - patch': 'patch all received order list' },
    ],
    [
      { '/api/item/id/_id - delete': 'delete all received order list' },
      { '/api/item/order_id - delete': 'delete all received order list' },
    ],
    [{ '/api/status': 'gets order by status' }],
  ]);
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
    status,
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
      status: 'placed',
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
app.get('/api/item/:id', async (req, res) => {
  try {
    const order_id = req.params.id;
    const getById = await Order.findOne({ order_id: order_id });
    res.send(getById);
  } catch (e) {
    res.status(400).send(e);
  }
});
app.get('/api/item/id/:id', async (req, res) => {
  try {
    const _id = req.params.id;
    const getById = await Order.findById({ _id });
    res.send(getById);
  } catch (e) {
    res.status(400).send(e);
  }
});
app.patch('/api/item/:id', async (req, res) => {
  try {
    order_id = req.params.id;
    const getById = await Order.findOneAndUpdate({ order_id }, req.body, {
      new: true,
    });
    res.send(getById);
  } catch (e) {
    res.status(400).send(e);
  }
});
app.patch('/api/item/id/:id', async (req, res) => {
  try {
    const _id = req.params.id;
    const getById = await Order.findByIdAndUpdate({ _id }, req.body, {
      new: true,
    });
    res.send(getById);
  } catch (e) {
    res.status(400).send(e);
  }
});
app.delete('/api/item/id/:id', async (req, res) => {
  try {
    const _id = req.params.id;
    const getById = await Order.findByIdAndDelete(req.params.id);
    res.send(getById);
  } catch (e) {
    res.status(400).send(e);
  }
});
app.delete('/api/item/:id', async (req, res) => {
  try {
    order_id = req.params.id;
    const getById = await Order.findOneAndDelete(req.params.id);
    res.send(getById);
  } catch (e) {
    res.status(400).send(e);
  }
});

app.get('/api/:statu', async (req, res) => {
  try {
    status = req.params.statu;
    const getById = await Order.find({ status: status });
    res.send(getById);
  } catch (e) {
    res.status(400).send(e);
  }
});
app.patch('/api/placed/:id', async (req, res) => {
  try {
    order_id = req.params.id;
    const getById = await Order.findOneAndUpdate({ order_id }, req.body, {
      new: true,
    });
    res.send(getById);
  } catch (e) {
    res.status(400).send(e);
  }
});

server.listen(PORT, () => {
  console.log(`site is live on http://localhost:${PORT}`);
});
