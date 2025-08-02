const express = require('express');
const mongoose = require('mongoose');
const shortUrlRoutes = require('./routes/shorturls');
const LoggingMiddleware = require('./middleware/loggingMiddleware');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(LoggingMiddleware);
app.use('/', shortUrlRoutes);

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('MongoDB Connected');
    app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
  })
  .catch(err => console.error(err));