const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const articleRoutes = require('./routes/articles');
const aiRoutes = require('./routes/ai');
const pexelsRoutes = require('./routes/pexels');
const unsplashRoutes = require('./routes/unsplash');
require('dotenv').config();

const app = express();


app.use(cors({
  origin: ['http://localhost:3000', 'http://127.0.0.1:3000', 'http://barracudagame.ru', 'http://109.71.240.224']
}));
app.use(express.json());
app.use('/api/articles', articleRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/pexels', pexelsRoutes);
app.use('/api/unsplash', unsplashRoutes);

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Сервер запущен на порту ${PORT}`);
});
