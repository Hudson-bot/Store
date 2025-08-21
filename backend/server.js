// const express = require('express');
// const bodyParser = require('body-parser');
// const cors = require('cors');
// const authRoutes = require('./routes/authRoutes');
// const storeRoutes = require('./routes/storeRoutes');
// const reviewRoutes = require('./routes/reviewRoutes');
// const adminRoutes = require('./routes/adminRoutes');
// const dotenv = require('dotenv');
// dotenv.config();

// const app = express();

// // Enable CORS for frontend before routes
// app.use(cors({
//   origin: 'http://localhost:5173',
//   credentials: true
// }));
// app.use(bodyParser.json());

// app.use('/api/auth', authRoutes);
// app.use("/api/store", storeRoutes);
// app.use("/api/review", reviewRoutes);
// app.use('/api/admin', adminRoutes);

// app.get('/', (req, res) => {
//   res.send('Backend running...');
// });

// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
// server.js
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const storeRoutes = require('./routes/storeRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const adminRoutes = require('./routes/adminRoutes'); // Make sure this import exists
const dotenv = require('dotenv');
dotenv.config();

const app = express();

// Enable CORS for frontend before routes
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));
app.use(bodyParser.json());

// Make sure adminRoutes is used
app.use('/api/auth', authRoutes);
app.use("/api/store", storeRoutes);
app.use("/api/review", reviewRoutes);
app.use('/api/admin', adminRoutes); // This should be present

app.get('/', (req, res) => {
  res.send('Backend running...');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
