const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 4000;

app.use(cors());
app.use(express.json());

// In-memory storage
let orders = {}; // { orderId: { address, lat, lng } }
let deliveryLocations = {}; // { orderId: { lat, lng, updatedAt } }
let nextOrderId = 1;

// Create a new order
app.post('/order', (req, res) => {
  const { address, lat, lng } = req.body;
  const orderId = nextOrderId++;
  orders[orderId] = { address, lat, lng };
  res.json({ orderId, address, lat, lng });
});

// Update delivery person's location for an order
app.post('/location', (req, res) => {
  const { orderId, lat, lng } = req.body;
  if (!orders[orderId]) {
    return res.status(404).json({ error: 'Order not found' });
  }
  deliveryLocations[orderId] = { lat, lng, updatedAt: Date.now() };
  res.json({ success: true });
});

// Get delivery person's latest location for an order
app.get('/location/:orderId', (req, res) => {
  const orderId = req.params.orderId;
  if (!orders[orderId]) {
    return res.status(404).json({ error: 'Order not found' });
  }
  const location = deliveryLocations[orderId];
  if (!location) {
    return res.status(404).json({ error: 'No delivery location yet' });
  }
  res.json(location);
});

// (Optional) Get order details
app.get('/order/:orderId', (req, res) => {
  const orderId = req.params.orderId;
  const order = orders[orderId];
  if (!order) {
    return res.status(404).json({ error: 'Order not found' });
  }
  res.json(order);
});

app.listen(PORT, () => {
  console.log(`Order tracking backend running on http://localhost:${PORT}`);
}); 