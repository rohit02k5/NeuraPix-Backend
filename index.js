import express from 'express';
import cors from 'cors';
import * as dotenv from 'dotenv';
import connectDB from './mongodb/connect.js';
import postRoutes from './routes/postRoutes.js';
import dalleRoutes from './routes/dalleRoutes.js';

dotenv.config();
const app = express();

// Configure CORS to allow requests from localhost:5173
app.use(
  cors({
    origin: 'https://neurapix-frontend-3.onrender.com',  // Allow requests from this domain (your frontend)
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type'],
  })
);

app.use(express.json({ limit: '50mb' }));

// Define routes
app.use('/api/v1/post', postRoutes);
app.use('/api/v1/huggingface', dalleRoutes);

app.get('/', (req, res) => {
  res.status(200).json({
    message: 'Hello from Hugging Face Stable Diffusion!',
  });
});

const startServer = async () => {
  try {
    await connectDB(process.env.MONGODB_URL);
    app.listen(8080, () => console.log('Server started on port 8080'));
  } catch (error) {
    console.error(error);
  }
};

startServer();
